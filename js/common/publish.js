/**
 * Created by ander on 12/10/18.
 */

let publishContainer;

(function () {

    function setUp() {
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
                title: null,
                description: '',
                adult: false,
                downloadFile: {
                    price: 0
                },
                publicDomain: LICENSE.NO_LICENSE.flag,
                share: LICENSE.NO_LICENSE.flag,
                commercial: LICENSE.NO_LICENSE.flag,
                noLicense: LICENSE.NO_LICENSE.flag,
                showEditor: false,
                tagsConfig: {
                    init: false,
                    addedEvents: false,
                },
                error: null
            },
            updated: function () {
                console.log('updating');
                if (this.step == 2) {
                    let inputTags = $('#publish-tags');
                    let that = this;
                    if (!this.tagsConfig.init) {
                        inputTags.tagsinput({
                            maxTags: CONSTANTS.MAX_TAGS,
                            maxChars: CONSTANTS.TEXT_MAX_SIZE.TAG,
                            delimiter: ' '
                        });

                        this.tagsConfig.init = true;
                    }

                    if (!this.tagsConfig.addedEvents) {
                        inputTags.on('beforeItemAdd', function (event) {
                            console.log('added item', event.item);
                            that.tags.push(event.item);
                        });

                        inputTags.on('itemRemoved', function (event) {
                            console.log('removed item', event.item);
                            let i = that.tags.indexOf(event.item);
                            if (i > -1) {
                                that.tags.splice(i, 1);
                            }
                        });

                        this.tagsConfig.addedEvents = true;
                    }
                }

            },
            methods: {
                getLicense: function () {
                    let license;
                    if (this.noLicense === LICENSE.NON_PERMISSION.flag) {
                        license = License.fromFlag(this.noLicense);
                    } else if (this.publicDomain === LICENSE.FREE_CONTENT.flag) {
                        license = License.fromFlag(this.publicDomain);
                    } else {
                        license = LICENSE.CREATIVE_COMMONS.flag | LICENSE.ATTRIBUTION.flag | this.share | this.commercial;
                        license = License.fromFlag(license);
                    }

                    return license;
                },
                nextStep: function () {
                    //Check errors before continue
                    switch (this.step) {
                        case 1:
                            this.error = this.bodyElements.length > 0 ? null : this.lang.PUBLISH.NO_ELEMENTS_ERROR;
                            break;
                        case 2:
                            if (!this.featuredImage || !this.title || this.tags.length == 0) {
                                this.error = this.lang.PUBLISH.NO_TITLE_TAG_OR_IMAGE;
                            } else {
                                this.error = null;
                            }
                    }

                    if (!this.error) {

                        this.step += 1;
                    }
                },
                loadFile: function (event) {
                    const elem = this.$refs.publishInputFile;
                    elem.click();
                },
                loadFeaturedImage: function (event) {
                    const elem = this.$refs.publishInputCover;
                    elem.click();
                },
                onInputDownloadFile: function (event) {
                    let files = event.target.files;
                    let that = this;
                    if (files.length > 0) {
                        globalLoading.show = true;
                        uploadToIpfs(files[0], function (err, file) {
                            globalLoading.show = false;
                            if (err) {
                                console.error(err);
                            } else {
                                file.resource = file.url;
                                that.downloadFile = Object.assign(that.downloadFile, jsonify(jsonstring(file)));
                            }
                        });
                    }
                },
                onLoadFile: function (event) {
                    let files = event.target.files;
                    if (files.length > 0) {
                        globalLoading.show = true;
                        uploadToIpfs(files[0], function (err, file) {
                            globalLoading.show = false;
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
                        globalLoading.show = true;
                        uploadToIpfs(files[0], function (err, file) {
                            globalLoading.show = false;
                            if (err) {
                                console.error(err);
                            } else {
                                publishContainer.featuredImage = file;
                            }
                        });
                    }
                },
                toggleEditor: function (event) {
                    event.preventDefault();
                    this.showEditor = !this.showEditor;
                },
                updateText: updateText,
                editText: editText,
                removeElement: removeElement,
                makePublication: makePublication,
                humanFileSize: humanFileSize
            }
        });

        creaEvents.emit('crea.dom.ready');
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

    function prepareDownload() {
        let download =  {
            url: '',
            name: '',
            type: '',
            size: '',
            password: '',
            price: 0
        }
    }

    function makePublication() {
        //All tags must be lowercase;
        globalLoading.show = true;
        let tags = publishContainer.tags;
        for (let x = 0; x < tags.length; x++)  {
            tags[x] = tags[x].toLowerCase();
        }

        let metadata = {
            description: publishContainer.description,
            tags: tags,
            adult: publishContainer.adult,
            featuredImage: publishContainer.featuredImage.url,
            license: publishContainer.getLicense().getFlag()
        };

        let download = publishContainer.downloadFile;
        download.price = Asset.parseString(download.price + ' CREA').toFriendlyString();

        //Build body
        let body = jsonstring(publishContainer.bodyElements);
        let title = publishContainer.title;
        let permlink = toPermalink(title);

        console.log(title, body, metadata, download);
        let session = Session.getAlive();
        crea.broadcast.comment(session.account.keys.posting.prv, '', toPermalink(metadata.tags[0]),
            session.account.username, permlink, title, body, jsonstring(download), jsonstring(metadata), function (err, result) {
            if (err) {
                console.error(err);
                globalLoading.show = false;
            } else {
                console.log(result);
                let post = {
                    url: '/' + toPermalink(metadata.tags[0]) + '/@' + session.account.username + "/" + permlink
                };
                showPost(post);
            }
        })
    }



    creaEvents.on('crea.content.loaded', function () {
        setUp();
    })

})();