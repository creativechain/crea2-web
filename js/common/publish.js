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

    if (!publishContainer) {
        publishContainer = new Vue({
            el: '#publish-container',
            data: {
                lang: lang,
                LICENSE: LICENSE,
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
                publicDomain: LICENSE.NO_LICENSE.flag,
                share: LICENSE.NO_LICENSE.flag,
                commercial: LICENSE.NO_LICENSE.flag
            },
            methods: {
                getLicense: function () {
                    let license;
                    if (this.publicDomain === LICENSE.FREE_CONTENT.flag) {
                        license = License.fromFlag(this.publicDomain);
                    } else {
                        license = LICENSE.CREATIVE_COMMONS.flag | LICENSE.ATTRIBUTION.flag | this.share | this.commercial;
                        license = License.fromFlag(license);
                    }

                    return license;
                },
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
                makePublication: makePublication,
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

    function makePublication() {
        let metadata = {
            description: publishContainer.description,
            tags: publishContainer.tags,
            adult: publishContainer.adult,
            price: publishContainer.price,
            featuredImage: publishContainer.featuredImage.url,
            download: publishContainer.downloadFile.url || '',
            license: publishContainer.getLicense().getFlag()
        };

        //Build body
        let body = '';

        let elements = publishContainer.bodyElements;
        let keys = Object.keys(elements);
        keys.forEach(function (k) {
            let el = elements[k];
            if (el.type.indexOf('text/html') > -1) {
                body += el.value;
            } else if (el.type.indexOf('image/') > -1) {
                body += '<p><div class="upload-img"> <img src="' + el.url + '"</img></div></p>';
            } else if (el.type.indexOf('video/') > -1) {
                body += '<p>' +
                    '<div class="upload-img"> ' +
                    '   <video controls>' +
                    '       <source src="' + el.url + '" type="' + el.type +'">' +
                    '   </video>' +
                    '</div></p>';
            } else if (el.type.indexOf('audio/') > -1) {
                body += '<p>' +
                    '<div class="upload-img"> ' +
                    '   <audio controls>' +
                    '       <source src="' + el.url + '" type="' + el.type +'">' +
                    '   </audio>' +
                    '</div></p>';
            }
        });

        let title = publishContainer.title;
        let permlink = toPermalink(title);
        console.log(title, body, metadata);
        let session = Session.getAlive();
        crea.broadcast.comment(session.account.keys.posting.prv, '', metadata.tags[0], session.account.username, permlink, title, body, JSON.stringify(metadata), function (err, result) {
            if (err) {
                console.error(err);
            } else {
                console.log(result);
            }
        })
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