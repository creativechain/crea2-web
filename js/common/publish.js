"use strict";

/**
 * Created by ander on 12/10/18.
 */

(function () {
    let session, account;
    let publishContainer;
    let postUploads = {};

    function setUp(editablePost) {
        let downloadFile = {
            price: 0,
            currency: 'CREA'
        };
        let featuredImage = {};
        let license = editablePost ? License.fromFlag(editablePost.metadata.license) : License.fromFlag(LICENSE.NO_LICENSE.flag);

        if (editablePost) {
            //
            //downloadFile = editablePost.download;
            let mFi = editablePost.metadata.featuredImage;
            featuredImage = mFi.url ? mFi : mfi ? {
                url: mFi
            } : featuredImage;
        }

        publishContainer = new Vue({
            el: '#publish-container',
            data: {
                lang: lang,
                session: session,
                LICENSE: LICENSE,
                CONSTANTS: CONSTANTS,
                step: 1,
                editablePost: editablePost,
                bodyElements: editablePost ? editablePost.body : [],
                tags: [],
                uploadedFiles: [],
                updatingIndex: -1,
                editor: {
                    editing: false,
                    show: false
                },
                featuredImage: featuredImage,
                title: editablePost ? editablePost.title : null,
                description: editablePost ? editablePost.metadata.description : '',
                adult: editablePost ? editablePost.metadata.adult : false,
                downloadFile: downloadFile,
                publicDomain: license.has(LICENSE.FREE_CONTENT.flag) ? LICENSE.FREE_CONTENT.flag : LICENSE.NO_LICENSE.flag,
                share: license.has(LICENSE.SHARE_ALIKE.flag) ? LICENSE.SHARE_ALIKE.flag : license.has(LICENSE.NON_DERIVATES.flag) ? LICENSE.NON_DERIVATES.flag : LICENSE.NO_LICENSE.flag,
                commercial: license.has(LICENSE.NON_COMMERCIAL.flag) ? LICENSE.NON_COMMERCIAL.flag : LICENSE.NO_LICENSE.flag,
                noLicense: license.has(LICENSE.NON_PERMISSION.flag) ? LICENSE.NON_PERMISSION.flag : LICENSE.NO_LICENSE.flag,
                showEditor: false,
                tagsConfig: {
                    init: false,
                    addedEvents: false
                },
                error: null
            },
            mounted: function mounted() {//creaEvents.emit('crea.dom.ready', 'publish');
            },
            updated: function updated() {
                console.log('updating');

                if (this.step !== 2) {
                    this.tagsConfig.init = false;
                    this.tagsConfig.addedEvents = false;
                }

                if (this.step === 2) {
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
                            if (!that.tags.includes(event.item)) {
                                that.tags.push(event.item);
                            }
                        });
                        inputTags.on('itemRemoved', function (event) {
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
                            });
                        }
                    }

                    if (that.tags.length > 0) {
                        that.tags.forEach(function (t) {
                            inputTags.tagsinput('add', t);
                        });
                    }
                }
            },
            methods: {
                getLicense: function getLicense() {
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
                toStep: function toStep(_toStep) {
                    if (!this.editor.show && this.step > _toStep) {
                        this.step = _toStep;
                    }
                },
                nextStep: function nextStep() {
                    let that = this;

                    if (!this.editor.show) {
                        //Check errors before continue
                        switch (this.step) {
                            case 1:
                                this.bodyElements = cleanArray(this.bodyElements);
                                this.error = this.bodyElements.length > 0 ? null : this.lang.PUBLISH.NO_ELEMENTS_ERROR;
                                break;

                            case 2:
                                if (!this.featuredImage.hash || !this.title || this.tags.length === 0) {
                                    this.error = this.lang.PUBLISH.NO_TITLE_TAG_OR_IMAGE;
                                } else {
                                    this.error = null;
                                }
                                break;

                            case 3:
                                if ((this.editablePost && this.editablePost.download.size) && !this.downloadFile.size) {
                                    this.error = String.format(this.lang.PUBLISH.RELOAD_DOWNLOAD_FILE, this.editablePost.download.size.name)
                                } else {
                                    this.error = null
                                }
                                break;

                        }

                        if (!this.error) {
                            this.step += 1;
                        }
                    }
                },
                loadFile: function loadFile(event) {
                    if (!this.editor.show) {
                        let elem = this.$refs.publishInputFile;
                        elem.click();
                    }
                },
                loadFeaturedImage: function loadFeaturedImage(event) {
                    let elem = this.$refs.publishInputCover;
                    elem.click();
                },
                onInputDownloadFile: function onInputDownloadFile(event) {
                    let files = event.target.files;
                    let that = this;

                    if (files.length > 0) {
                        globalLoading.show = true;
                        let loadedFile = files[0];
                        let maximumSize = CONSTANTS.FILE_MAX_SIZE.POST_BODY.DOWNLOAD;
                        uploadToIpfs(loadedFile, maximumSize, function (err, file) {
                            globalLoading.show = false;

                            if (!catchError(err)) {
                                file.resource = file.url;
                                that.downloadFile = Object.assign(that.downloadFile, jsonify(jsonstring(file)));
                                if (that.editablePost) {
                                    that.editablePost.downloadUploaded = file.size > 0;
                                }
                            }
                        });
                    }
                },
                onLoadFile: function onLoadFile(event) {
                    let that = this;
                    let files = event.target.files;
                    let loadedFile = files[0];

                    console.log('File loading', loadedFile);
                    if (files.length > 0) {
                        globalLoading.show = true;

                        let [fileType, fileFormat] = loadedFile.type.toUpperCase().split('/');
                        let maximumSize = CONSTANTS.FILE_MAX_SIZE.POST_BODY[fileType];

                        //Reset maximum size of video files to allow only webm or mo4
                        if (fileType.includes('VIDEO')) {
                            maximumSize = 0;
                        }
                        //Set specific file format sizes
                        if (CONSTANTS.FILE_MAX_SIZE.POST_BODY[fileFormat]) {
                            maximumSize = CONSTANTS.FILE_MAX_SIZE.POST_BODY[fileFormat];
                        }

                        //Show alert for video formats not allowed
                        if (fileType.includes('VIDEO') && maximumSize <= 0) {
                            globalLoading.show = false;
                            return catchError({ TITLE: lang.PUBLISH.FILE_NOT_ALLOWED, BODY: [lang.PUBLISH.ALLOWED_VIDEO_FORMATS]})
                        }

                        console.log('file:', loadedFile, 'MaxSize:', maximumSize, 'isGif', loadedFile.type.toLowerCase().includes('image/gif'));
                        uploadToIpfs(loadedFile, maximumSize, function (err, file) {
                            globalLoading.show = false;

                            if (err) {
                                that.error = err;
                            } else {

                                that.bodyElements.push(file);
                                postUploads[file.hash] = loadedFile;
                                that.error = null;

                                resizeImage(loadedFile, function (resizedFile) {
                                    let maximumPreviewSize = CONSTANTS.FILE_MAX_SIZE.POST_PREVIEW[loadedFile.type.toUpperCase().split('/')[0]];
                                    postUploads[file.hash] = {
                                        original: loadedFile,
                                        resized: resizedFile
                                    };

                                    //Set first loaded image as preview
                                    if (file.type.indexOf('image/') > -1 && !that.featuredImage.hash) {
                                        uploadToIpfs(resizedFile, maximumPreviewSize, function (err, uploadedPreview) {
                                            if (!err) {
                                                that.featuredImage = uploadedPreview;
                                                console.log('Featured image loaded!');
                                            } else {
                                                console.error(err, resizedFile)
                                            }

                                        })
                                    }

                                });

                                //Clear input
                                let elem = that.$refs.publishInputFile;
                                $(elem).val('');
                            }
                        });
                    }
                },
                onLoadFeaturedImage: function onLoadFeaturedImage(event) {
                    let that = this;
                    let files = event.target.files;

                    if (files.length > 0) {
                        globalLoading.show = true;
                        let loadedFile = files[0];
                        let maximumSize = CONSTANTS.FILE_MAX_SIZE.POST_PREVIEW[loadedFile.type.toUpperCase().split('/')[0]];
                        resizeImage(loadedFile, function (resizedFile) {
                            uploadToIpfs(resizedFile, maximumSize, function (err, file) {
                                globalLoading.show = false;

                                if (!catchError(err)) {
                                    that.featuredImage = file;
                                    postUploads[file.hash] = loadedFile;
                                    that.error = null;
                                }
                            });
                        });

                    }
                },
                toggleEditor: function toggleEditor(event) {
                    cancelEventPropagation(event);

                    if (!this.editor.show) {
                        this.editor.show = !this.editor.show;
                    }
                },
                editorInput: function editorInput(data) {
                    this.editor.editing = data.length > 0;
                },
                editorEmbedVideo: function(url, data) {
                    let embedElement = {
                        type: 'embed/' + data.reproductor,
                        value: url,
                        player: data.reproductor
                    };

                    this.bodyElements.push(embedElement);
                },
                updateText: updateText,
                removeTitleEmojis: removeTitleEmojis,
                removeDescriptionEmojis: removeDescriptionEmojis,
                editText: editText,
                removeElement: removeElement,
                makePublication: makePublication,
                humanFileSize: humanFileSize,
                stringFormat: String.format
            }
        });
    }

    function removeTitleEmojis(event) {
        let target = event.target;
        publishContainer.title = removeEmojis(target.value);
    }

    function removeDescriptionEmojis(event) {
        let target = event.target;
        publishContainer.description = removeEmojis(target.value);
    }

    function updateText() {
        let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
        let editor = CKEDITOR.instances['editor'];
        let text = editor.getData();

        if (!text.isEmpty()) {
            if (index > -1) {
                publishContainer.bodyElements[index].value = text;
            } else {
                publishContainer.bodyElements.push({
                    value: text,
                    type: 'text/html'
                });
            }

            publishContainer.updatingIndex = -1;
            editor.setData('');
            publishContainer.editor.editing = false;
            publishContainer.editor.show = false;
        }
    }

    function editText(index) {
        console.log('Editing text', index);

        if (index > -1) {
            publishContainer.editor.show = true;
            setTimeout(function () {
                let editor = CKEDITOR.instances['editor'];
                let text = publishContainer.bodyElements[index].value;
                editor.setData(text);
                publishContainer.updatingIndex = index;
                publishContainer.editor.editing = true;
            }, 500);
        }
    }

    function removeElement(index) {
        if (index > -1 && index <= publishContainer.bodyElements.length - 1) {
            let element = publishContainer.bodyElements[index];
            publishContainer.bodyElements.splice(index, 1);

            //If preview image = element, so set preview image next image in post
            if (element.type.includes('image/')) {
                let files = postUploads[element.hash];
                if (files.resized.name === publishContainer.featuredImage.name && files.resized.size === publishContainer.featuredImage.size) {
                    publishContainer.featuredImage = {};
                    delete postUploads[element.hash];
                }
            }

            if (!publishContainer.featuredImage.hash) {
                //Set first image of post body as featuredImage
                for (let x = 0; x < publishContainer.bodyElements.length; x++) {
                    let bodyEl = publishContainer.bodyElements[x];
                    if (bodyEl.type.includes('image/')) {
                        let maximumPreviewSize = CONSTANTS.FILE_MAX_SIZE.POST_PREVIEW['IMAGE'];
                        let newFiles = postUploads[bodyEl.hash];
                        console.log('Selected new featured image', newFiles.resized.name, bodyEl.hash);
                        uploadToIpfs(newFiles.resized, maximumPreviewSize, function (err, uploadedPreview) {
                            if (!err) {
                                console.log('Preview uploaded', uploadedPreview);
                                publishContainer.featuredImage = uploadedPreview;
                                console.log('Featured image loaded!');
                            } else {
                                console.error(err, newFiles.resized);
                            }

                        });

                        break;
                    }
                }
            }

            publishContainer.$forceUpdate();

        }
    }

    function makePublication(event) {
        cancelEventPropagation(event);
        let username = session.account.username;
        requireRoleKey(username, 'posting', function (postingKey) {
            let _crea$broadcast;

            //All tags must be lowercase;
            globalLoading.show = true;
            let tags = publishContainer.tags;

            let nTags = [];
            for (let x = 0; x < tags.length; x++) {
                let t = normalizeTag(tags[x]);
                if (!nTags.includes(t)) {
                    nTags.push(t);
                }
            }

            let metadata = {
                description: publishContainer.description,
                tags: nTags,
                adult: publishContainer.adult,
                featuredImage: publishContainer.featuredImage,
                license: publishContainer.getLicense().getFlag()
            };
            let download = publishContainer.downloadFile;

            if (!download.price) {
                download.price = 0;
            }

            download.price = Asset.parseString(download.price + ' ' + download.currency).toFriendlyString(null, false);

            if (!download.resource) {
                download = '';
            }

            //Build body
            let body = jsonstring(publishContainer.bodyElements);
            let title = publishContainer.title;
            let editing = !!publishContainer.editablePost;
            let permlink = editing ? publishContainer.editablePost.permlink : toPermalink(title); //Add category to tags if is editing

            let publishPost = function () {
                if (editing && publishContainer.editablePost.metadata.tags) {
                    let category = publishContainer.editablePost.metadata.tags[0];

                    if (category && !metadata.tags.includes(category)) {
                        metadata.tags.unshift(category);
                    }
                }

                let operations = [];
                operations.push(crea.broadcast.commentBuilder('', toPermalink(metadata.tags[0]), username, permlink, title, body, jsonstring(download), jsonstring(metadata)));
                let rewards = account.user.metadata.post_rewards;
                if (editing) {
                    switch (publishContainer.editablePost.percent_crea_dollars) {
                        case 10000:
                            rewards = '0';
                            break;
                        case 0:
                            rewards = '100';
                            break;
                        default:
                            rewards = '50';
                    }
                }
                switch (rewards) {
                    case '0':
                        operations.push(crea.broadcast.commentOptionsBuilder(username, permlink, '0.000 CBD', 10000, true, true, []));
                        break;
                    case '50':
                        break;
                    case '100':
                    default:
                        operations.push(crea.broadcast.commentOptionsBuilder(username, permlink, '1000000.000 CBD', 0, true, true, []));
                        break;
                }

                let keys = [postingKey];

                (_crea$broadcast = crea.broadcast).sendOperations.apply(_crea$broadcast, [keys].concat(operations, [function (err, result) {
                    if (!catchError(err)) {
                        console.log(result);
                        let post = {
                            url: '/' + toPermalink(metadata.tags[0]) + '/@' + session.account.username + "/" + permlink
                        };
                        showPost(post);
                    } else {
                        globalLoading.show = false;
                    }
                }]));
            };

            if (!editing) {
                //Check if already has a post with same permlink
                crea.api.getDiscussion(username, permlink, function (err, result) {
                    console.log(err, result);
                    if (!err) {
                        //If id is 0, post not exists, so publish
                        if (result.id !== 0) {
                            catchError(lang.ERROR.PERMLINK_ALREADY_EXISTS);
                            globalLoading.show = false;
                        } else {
                            publishPost();
                        }
                    }
                })
            } else {
                publishPost();
            }


        });
    }

    creaEvents.on('crea.content.loaded', function () {
        let edit = getParameterByName('edit');

        if (edit) {
            let author = edit.split('/')[0];
            let permlink = edit.split('/')[1]; //Check if author is the user

            let s = Session.getAlive();

            if (s && s.account.username === author) {
                crea.api.getDiscussion(author, permlink, function (err, post) {
                    if (!catchError(err)) {
                        post = parsePost(post);
                        let price = Asset.parse(post.download.price);
                        post.download.price = parseFloat(price.toPlainString());
                        post.download.currency = price.asset.symbol;
                        post.downloadUploaded = false;
                        setUp(post);
                    }
                });
            } else {//TODO: SHOW EDIT ERROR
            }
        } else {
            setUp();
        }
    });

    creaEvents.on('crea.session.login', function (s, a) {
        session = s;

        if (publishContainer) {
            publishContainer.session = s;
            publishContainer.$forceUpdate();
        }

        account = a;
        creaEvents.emit('crea.dom.ready');
    });

})();