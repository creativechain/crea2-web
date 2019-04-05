"use strict";

/**
 * Created by ander on 12/10/18.
 */
(function () {
    var publishContainer;
    var session, account;

    function setUp(editablePost) {
        var downloadFile = {
            price: 0,
            currency: 'CREA'
        };
        var featuredImage = {};
        var license = editablePost ? License.fromFlag(editablePost.metadata.license) : License.fromFlag(LICENSE.NO_LICENSE.flag);

        if (editablePost) {
            //
            //downloadFile = editablePost.download;
            var mFi = editablePost.metadata.featuredImage;
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
                    var inputTags = $('#publish-tags');
                    var that = this;

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
                            var i = that.tags.indexOf(event.item);

                            if (i > -1) {
                                that.tags.splice(i, 1);
                            }
                        });
                        this.tagsConfig.addedEvents = true;

                        if (editablePost) {
                            var tags = editablePost.metadata.tags;
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
                    var license;

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
                    var that = this;

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
                        var elem = this.$refs.publishInputFile;
                        elem.click();
                    }
                },
                loadFeaturedImage: function loadFeaturedImage(event) {
                    var elem = this.$refs.publishInputCover;
                    elem.click();
                },
                onInputDownloadFile: function onInputDownloadFile(event) {
                    var files = event.target.files;
                    var that = this;

                    if (files.length > 0) {
                        globalLoading.show = true;
                        var loadedFile = files[0];
                        var maximumSize = CONSTANTS.FILE_MAX_SIZE.POST_BODY.DOWNLOAD;
                        uploadToIpfs(loadedFile, maximumSize, function (err, file) {
                            globalLoading.show = false;

                            if (!catchError(err)) {
                                file.resource = file.url;
                                that.downloadFile = Object.assign(that.downloadFile, jsonify(jsonstring(file)));
                            }
                        });
                    }
                },
                onLoadFile: function onLoadFile(event) {
                    var that = this;
                    var files = event.target.files;

                    console.log('File loading', event);
                    if (files.length > 0) {
                        globalLoading.show = true;
                        var loadedFile = files[0];
                        var maximumSize = CONSTANTS.FILE_MAX_SIZE.POST_BODY[loadedFile.type.toUpperCase().split('/')[0]];
                        console.log('file:', loadedFile, 'MaxSize:', maximumSize);
                        uploadToIpfs(loadedFile, maximumSize, function (err, file) {
                            globalLoading.show = false;

                            if (err) {
                                that.error = err;
                            } else {

                                that.bodyElements.push(file);
                                that.error = null;

                                //Set first loaded image as preview
                                if (file.type.indexOf('image/') > -1 && !that.featuredImage.hash) {
                                    that.featuredImage = file;
                                    console.log('Featured image loaded!');
                                }

                                //Clear input
                                var elem = that.$refs.publishInputFile;
                                $(elem).val('');
                            }
                        });
                    }
                },
                onLoadFeaturedImage: function onLoadFeaturedImage(event) {
                    var that = this;
                    var files = event.target.files;

                    if (files.length > 0) {
                        globalLoading.show = true;
                        var loadedFile = files[0];
                        var maximumSize = CONSTANTS.FILE_MAX_SIZE.POST_PREVIEW[loadedFile.type.toUpperCase().split('/')[0]];
                        uploadToIpfs(loadedFile, maximumSize, function (err, file) {
                            globalLoading.show = false;

                            if (!catchError(err)) {
                                that.featuredImage = file;
                                that.error = null;
                            }
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
        var target = event.target;
        publishContainer.title = removeEmojis(target.value);
    }

    function removeDescriptionEmojis(event) {
        var target = event.target;
        publishContainer.description = removeEmojis(target.value);
    }

    function updateText() {
        var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
        var editor = CKEDITOR.instances['editor'];
        var text = editor.getData();

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
                var editor = CKEDITOR.instances['editor'];
                var text = publishContainer.bodyElements[index].value;
                editor.setData(text);
                publishContainer.updatingIndex = index;
                publishContainer.editor.editing = true;
            }, 500);
        }
    }

    function removeElement(index) {
        if (index > -1 && index <= publishContainer.bodyElements.length - 1) {
            publishContainer.bodyElements.splice(index, 1);
        }
    }

    function makePublication(event) {
        cancelEventPropagation(event);
        var username = session.account.username;
        requireRoleKey(username, 'posting', function (postingKey) {
            var _crea$broadcast;

            //All tags must be lowercase;
            globalLoading.show = true;
            var tags = publishContainer.tags;

            for (var x = 0; x < tags.length; x++) {
                tags[x] = tags[x].toLowerCase();
            }

            var metadata = {
                description: publishContainer.description,
                tags: tags,
                adult: publishContainer.adult,
                featuredImage: publishContainer.featuredImage,
                license: publishContainer.getLicense().getFlag()
            };
            var download = publishContainer.downloadFile;

            if (!download.price) {
                download.price = 0;
            }

            download.price = Asset.parseString(download.price + ' ' + download.currency).toFriendlyString(null, false);

            if (!download.resource) {
                download = '';
            }

            //Build body
            var body = jsonstring(publishContainer.bodyElements);
            var title = publishContainer.title;
            var permlink = publishContainer.editablePost ? publishContainer.editablePost.permlink : toPermalink(title); //Add category to tags if is editing

            if (publishContainer.editablePost && publishContainer.editablePost.metadata.tags) {
                var category = publishContainer.editablePost.metadata.tags[0];

                if (category && !metadata.tags.includes(category)) {
                    metadata.tags.unshift(category);
                }
            }

            var operations = [];
            operations.push(crea.broadcast.commentBuilder('', toPermalink(metadata.tags[0]), username, permlink, title, body, jsonstring(download), jsonstring(metadata)));

            switch (account.user.metadata.post_rewards) {
                case '0':
                    operations.push(crea.broadcast.commentOptionsBuilder(username, permlink, '0.000 CBD', 10000, true, true, []));
                    break;

                case '100':
                    operations.push(crea.broadcast.commentOptionsBuilder(username, permlink, '1000000.000 CBD', 0, true, true, []));
            }

            var keys = [postingKey];

            (_crea$broadcast = crea.broadcast).sendOperations.apply(_crea$broadcast, [keys].concat(operations, [function (err, result) {
                if (!catchError(err)) {
                    console.log(result);
                    var post = {
                        url: '/' + toPermalink(metadata.tags[0]) + '/@' + session.account.username + "/" + permlink
                    };
                    showPost(post);
                } else {
                    globalLoading.show = false;
                }
            }]));
        });
    }

    creaEvents.on('crea.content.loaded', function () {
        var edit = getParameterByName('edit');

        if (edit) {
            var author = edit.split('/')[0];
            var permlink = edit.split('/')[1]; //Check if author is the user

            var s = Session.getAlive();

            if (s && s.account.username === author) {
                crea.api.getDiscussion(author, permlink, function (err, post) {
                    if (!catchError(err)) {
                        post = parsePost(post);
                        var price = Asset.parse(post.download.price);
                        post.download.price = parseFloat(price.toPlainString());
                        post.download.currency = price.asset.symbol;
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
        publishContainer.session = s;
        publishContainer.$forceUpdate();
        account = a;
        creaEvents.emit('crea.dom.ready');
    });
})();