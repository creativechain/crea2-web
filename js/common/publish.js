/**
 * Created by ander on 12/10/18.
 */

let publishContainer;

(function () {

    class IpfsFile {
        constructor(hash, name, type, size) {
            this.hash = hash;
            this.name = name;
            this.type = type;
            this.size = size;
            this.url = 'https://ipfs.io/ipfs/' + hash;
        }
    }

    Vue.component('ckeditor', {
        template: `<textarea :id="id" :value="value" rows=30 cols=80></textarea>`,
        props: {
            value: {
                type: String
            },
            id: {
                type:String,
                default: 'editor',
            }
        },
        beforeUpdate () {
            const ckeditorId = this.id;
            if (this.value !== CKEDITOR.instances[ckeditorId].getData()) {
                CKEDITOR.instances[ckeditorId].setData(this.value);
            }
        },
        mounted () {
            const ckeditorId = this.id;
            console.log(this.value);
            const config = {};
            config.toolbarGroups = [
                { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
                { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
                { name: 'links', groups: [ 'links' ] },
                { name: 'styles', groups: [ 'styles' ] },
                { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
                { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
                { name: 'insert', groups: [ 'insert' ] },
                { name: 'forms', groups: [ 'forms' ] },
                { name: 'tools', groups: [ 'tools' ] },
                { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
                { name: 'others', groups: [ 'others' ] },
                '/',
                { name: 'colors', groups: [ 'colors' ] },
                { name: 'about', groups: [ 'about' ] }
            ];

            config.removeButtons = 'Subscript,Superscript,PasteText,PasteFromWord,Undo,Redo,Scayt,Anchor,Image,Maximize,Source,HorizontalRule,Table,SpecialChar,Strike,RemoveFormat,NumberedList,Blockquote,About,BulletedList';
            //Disallow tags, classes and attributes
            config.disallowedContent = 'img script *[on*] *[style]';

            // Set the most common block elements.
            config.format_tags = 'p;h1;h2;h3;h4;pre';
            // Simplify the dialog windows.
            config.removeDialogTabs = 'image:advanced;link:advanced';
            config.resize_enabled = true;
            //config.extraPlugins = 'html5audio,html5video';

            CKEDITOR.replace(ckeditorId, config);
            //CKEDITOR.disableAutoInline = true;
            //CKEDITOR.inline(ckeditorId, config);

            CKEDITOR.instances[ckeditorId].setData(this.value);
            CKEDITOR.instances[ckeditorId].on('change', () => {
                let ckeditorData = CKEDITOR.instances[ckeditorId].getData();
                if (ckeditorData !== this.value) {
                    this.$emit('input', ckeditorData)
                }
            });
        },
        destroyed () {
            const ckeditorId = this.id;
            if (CKEDITOR.instances[ckeditorId]) {
                CKEDITOR.instances[ckeditorId].destroy()
            }
        }
    });

    if (!publishContainer) {
        publishContainer = new Vue({
            el: '#publish-container',
            data: {
                lang: lang,
                CONSTANTS: CONSTANTS,
                step: 1,
                bodyElements: [],
                tags: [],
                uploadedFiles: [],
                updatingIndex: -1,
                featuredImage: {},
                title: '',
                description: '',
                price: 0,
                adult: false,
                downloadFile: {},
                license: -1,

            },
            methods: {
                nextStep: function () {
                    this.step += 1;
                },
                loadFile: function (event) {
                    const elem = this.$refs.publishInputFile;
                    elem.click();
                },
                loadFeaturedImage: function (event) {
                    const elem = this.$refs.publishInputCover;
                    elem.click();
                },
                onLoadFile: function (event) {
                    let files = event.target.files;
                    if (files.length > 0) {
                        uploadToIpfs(files[0], function (err, file) {
                            if (err) {
                                console.error(err);
                            } else {
                                publishContainer.bodyElements.push(file);
                            }
                        });
                    }
                },
                onLoadFeaturedImage: function (event) {
                    let files = event.target.files;
                    if (files.length > 0) {
                        uploadToIpfs(files[0], function (err, file) {
                            if (err) {
                                console.error(err);
                            } else {
                                publishContainer.featuredImage = file;
                            }
                        });
                    }
                },
                updateText: updateText,
                editText: editText,
                removeElement: removeElement,
                onTitleChange: function (event) {
                    this.title = event.target.value;
                },
                onDescriptionChange: function (event) {
                    this.description = event.target.value;
                },
                onTagsChange: function (event) {
                    this.tags = event.target.value.split(' ');
                }
            }
        })
    }

    function updateText(index = -1) {
        let editor = CKEDITOR.instances['editor'];
        let text = editor.getData();

        if (index > -1) {
            publishContainer.bodyElements[index].value = text;
        } else {
            publishContainer.bodyElements.push({
                value: text,
                type: 'text/html'
            })
        }

        publishContainer.updatingIndex = -1;
        editor.setData('');
    }

    function editText(index) {
        if (index > -1) {
            let editor = CKEDITOR.instances['editor'];
            let text = publishContainer.bodyElements[index].value;
            editor.setData(text);
            publishContainer.updatingIndex = index;
        }
    }

    function removeElement(index) {
        if (index > -1 && index <= (publishContainer.bodyElements.length -1)) {
            publishContainer.bodyElements.splice(index, 1);
        }
    }

    function uploadToIpfs(file, callback) {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            let maximumSize = CONSTANTS.FILE_MAX_SIZE[file.type.toUpperCase().split('/')[0]];
            if (file.size <= maximumSize) {
                console.log('Upload', file);
                let fileName = file.name;
                let mimeType = file.type;
                let fr = new FileReader();

                fr.onload = function (loadedFile) {
                    console.log('File loaded', loadedFile);

                    let progress = function (uploaded) {
                        console.log('Progress', uploaded);
                    };

                    let fileData = toBuffer(fr.result);
                    ipfs.files.add(fileData, {progress: progress}, function (err, files) {
                        console.log('Pushed to ipfs', err, files);
                        if (err) {
                            if (callback) {
                                callback(err);
                            }
                        } else if (files) {
                            let file = files[0];
                            file = new IpfsFile(file.hash, fileName, mimeType, file.size);
                            if (callback) {
                                callback(null, file);
                            }
                        }

                    });
                };
                fr.readAsArrayBuffer(file);
            } else {
                console.error('File', file.name, 'too large. Size:', file.size, 'MAX:', maximumSize);
            }
        } else {
            console.error('File API unsupported');
        }

    }

})();