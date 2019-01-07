/**
 * Created by ander on 12/10/18.
 */

let publishContainer;

(function () {

    function setUp(editablePost) {
        let downloadFile = {
            price: 0
        };

        let featuredImage = {};
        let license = editablePost ? License.fromFlag(editablePost.metadata.license) : License.fromFlag(LICENSE.NO_LICENSE.flag);

        if (editablePost) {
            downloadFile = editablePost.download;

            let mFi = editablePost.metadata.featuredImage;
            featuredImage = mFi.url ? mFi : mfi ? {url: mFi} : featuredImage;
        }

        publishContainer = new Vue({
            el: '#publish-container',
            data: {
                lang: lang,
                LICENSE: LICENSE,
                CONSTANTS: CONSTANTS,
                step: 1,
                editablePost: editablePost,
                bodyElements: editablePost ? editablePost.body : [],
                tags: [],
                uploadedFiles: [],
                updatingIndex: -1,
                featuredImage: featuredImage,
                title: editablePost ? editablePost.title : null,
                description: editablePost ? editablePost.metadata.description : '',
                adult: editablePost ? editablePost.metadata.adult : false,
                downloadFile: downloadFile,
                publicDomain: license.has(LICENSE.FREE_CONTENT.flag) ? LICENSE.FREE_CONTENT.flag : LICENSE.NO_LICENSE.flag,
                share: license.has(LICENSE.SHARE_ALIKE.flag) ? LICENSE.SHARE_ALIKE.flag : license.has(LICENSE.NON_DERIVATES.flag) ?  LICENSE.NON_DERIVATES.flag : LICENSE.NO_LICENSE.flag,
                commercial: license.has(LICENSE.NON_COMMERCIAL.flag) ? LICENSE.NON_COMMERCIAL.flag : LICENSE.NO_LICENSE.flag,
                noLicense: license.has(LICENSE.NON_PERMISSION.flag) ? LICENSE.NON_PERMISSION.flag : LICENSE.NO_LICENSE.flag,
                showEditor: false,
                tagsConfig: {
                    init: false,
                    addedEvents: false,
                },
                error: null
            },
            mounted: function () {
                //creaEvents.emit('crea.dom.ready', 'publish');
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
                        if (editablePost) {
                            let tags = editablePost.metadata.tags;
                            tags.forEach(function (t) {
                                inputTags.tagsinput('add', t);
                            })
                        }

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
                            if (!this.featuredImage.hash || !this.title || this.tags.length == 0) {
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

                        let loadedFile = files[0];
                        let maximumSize = CONSTANTS.FILE_MAX_SIZE.DOWNLOAD;

                        uploadToIpfs(loadedFile, maximumSize, function (err, file) {
                            globalLoading.show = false;
                            if (!catchError(err)) {
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

                        let loadedFile = files[0];
                        let maximumSize = CONSTANTS.FILE_MAX_SIZE[loadedFile.type.toUpperCase().split('/')[0]];

                        console.log('file:', loadedFile, 'MaxSize:', maximumSize);
                        uploadToIpfs(loadedFile, maximumSize, function (err, file) {
                            globalLoading.show = false;
                            if (!catchError(err)) {
                                publishContainer.bodyElements.push(file);
                            }
                        });
                    }
                },
                onLoadFeaturedImage: function (event) {
                    let files = event.target.files;
                    if (files.length > 0) {
                        globalLoading.show = true;

                        let loadedFile = files[0];
                        let maximumSize = CONSTANTS.FILE_MAX_SIZE[loadedFile.type.toUpperCase().split('/')[0]];

                        uploadToIpfs(loadedFile, maximumSize, function (err, file) {
                            globalLoading.show = false;
                            if (!catchError(err)) {
                                publishContainer.featuredImage = file;
                                publishContainer.error = null;
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

    function makePublication(event) {
        cancelEventPropagation(event);

        let session = Session.getAlive();
        let username = session.account.username;

        requireRoleKey(username, 'posting', function (postingKey) {

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
                featuredImage: publishContainer.featuredImage,
                license: publishContainer.getLicense().getFlag()
            };

            let download = publishContainer.downloadFile;
            download.price = Asset.parseString(download.price + ' CREA').toFriendlyString(null, false);
            if (!download.resource) {
                download = '';
            }

            //Build body
            let body = jsonstring(publishContainer.bodyElements);
            let title = publishContainer.title;
            let permlink = publishContainer.editablePost ? publishContainer.editablePost.permlink : toPermalink(title);

            console.log(title, body, metadata, download);

            crea.broadcast.comment(postingKey, '', toPermalink(metadata.tags[0]), username, permlink, title, body,
                jsonstring(download), jsonstring(metadata), function (err, result) {
                    if (!catchError(err)) {
                        console.log(result);
                        let post = {
                            url: '/' + toPermalink(metadata.tags[0]) + '/@' + session.account.username + "/" + permlink
                        };
                        showPost(post);
                    } else {
                        globalLoading.show = false;
                    }
                })

        });

    }

    creaEvents.on('crea.content.loaded', function () {
        let edit = getParameterByName('edit');
        if (edit) {
            let author = edit.split('/')[0];
            let permlink = edit.split('/')[1];
            console.log(author, permlink);

            //Check if author is the user
            let s = Session.getAlive();
            if (s && s.account.username === author) {
                crea.api.getDiscussion(author, permlink, function (err, post) {
                    if (!catchError(err)) {
                        console.log(post);
                        post.body = jsonify(post.body) || {};
                        post.metadata = jsonify(post.json_metadata) || {};
                        post.download.price = parseFloat(Asset.parse(post.download.price).toPlainString());
                        setUp(post);
                    }
                })
            } else {
                //TODO: SHOW EDIT ERROR
            }


        } else {
            setUp();
        }


    });

    creaEvents.on('crea.session.login', function (s, a) {
        creaEvents.emit('crea.dom.ready', 'publish');
    })

})();