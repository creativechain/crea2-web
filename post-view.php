<?php include ('element/navbar.php'); ?>
<div class="main-container post-view">
    <div id="home-banner">
        <?php include ('modules/banner.php') ?>
    </div>

    <section id="post-view">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-11">
                    <div class="border-post-view feature">
                        <div class="row">
                            <div class="col-md-9 border-box full-post">
                                <div class="row">
                                    <div class="col-md-12 img-post-view content-post" v-html="state.post.body">

                                    </div>
                                </div>
                                <div class="container">
                                    <div class="row row-promote justify-content-center">
                                        <div class=" col-md-4">
                                            <button type="submit" class="btn btn--primary type--uppercase">{{ lang.BUTTON.PROMOTE }}</button>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12"><p class="subtitle-content-publish">{{ lang.PUBLICATION.MORE_PROJECTS }}</p></div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="img-more-projects"></div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="img-more-projects"></div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="img-more-projects"></div>
                                        </div>
                                    </div>
                                    <!--<div class="row">
                                        <div class="col-md-12"><p class="subtitle-content-publish">{{ lang.PUBLICATION.YOUR_COMMENTS }}</p></div>
                                    </div>-->
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="boxed boxed--border box-comment">
                                                <div v-if="session" class="row">
                                                    <div class="col-md-12 row-comment">
                                                        <div class="user-avatar">
                                                            <div class="img-user-avatar"></div>
                                                        </div>
                                                        <div class="textarea">
                                                            <textarea name="text" placeholder="Message" rows="4" v-model="comment"></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-2 m-3">
                                                        <a class="btn btn--primary w-100" href="#/" v-on:click="makeComment">
                                                            <span class="btn__text">
                                                                {{ lang.BUTTON.POST_COMMENT }}
                                                            </span>
                                                        </a>
                                                    </div>
                                                </div>

                                                <hr>

                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <h3>{{ lang.PUBLICATION.COMMENTS + ' (' + state.post.children + ')' }}</h3>
                                                    </div>
                                                </div>

                                                <template v-for="c in state.comments">
                                                    <div v-if="c != state.postKey" class="row">
                                                        <div class="col-md-12">
                                                            <div class="row-post-comments">
                                                                <div class="user-avatar">
                                                                    <div class="img-user-avatar"></div>
                                                                </div>
                                                                <div class="user-comments">
                                                                    <p>{{ state.accounts[state.content[c].author].metadata.publicName || state.content[c].author }}
                                                                        <img src="/img/icons/trainer.svg" alt="">
                                                                        <span>{{ dateFromNow(state.content[c].created) }}</span></p>
                                                                    <span class="comment-user">{{ state.content[c].body }}</span>
                                                                    <div class="row">
                                                                        <div class="col-md-12">
                                                                            <ul class="list-inline list-unstyled ul-row-share-comment">
                                                                                <li><a href="#/" v-on:click="makeVote(state.content[c])"><img src="/img/icons/like.svg" alt="">{{ state.content[c].active_votes.length }}</a></li>
                                                                                <li><p>{{ state.content[c].pending_payout_value }}</p></li>
                                                                                <li v-if="session"><p>Comentar</p></li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>


                                                <hr>

                                                <div class="row">
                                                    <div class="col-md-12 text-center">
                                                        <a href="" class="more-comments">{{ lang.PUBLICATION.MORE_COMMENTS }}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="boxed boxed--border box-blockchain-certificate">
                                                <img class="certificat-flag" src="/img/crea-web/publish/flag.png" alt="">
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div class="feature feature-2">
                                                            <div class="feature__body">
                                                                <ul class="list-unstyled list-inline w-100 mb-0">
                                                                    <li><h2 class="title-certificate">{{ lang.PUBLICATION.CERTIFICATE }}</h2></li>
                                                                    <ul class="float-right">
                                                                        <li class="li-blockchain-certificate">
                                                                            <template v-for="i in getLicense().getIcons('white')">
                                                                                <img v-bind:src="i" alt="">
                                                                            </template>
                                                                        </li>
                                                                    </ul>
                                                                </ul>
                                                                <hr>
                                                                <p>License: Creative Commons BY-SA</p>
                                                                <p>Timestamp: {{ new Date(state.post.created).toLocaleString() }}</p>
                                                                <p>{{ state.post.metadata.hash || '-' }}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="boxed boxed--border box-report">
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <ul class="list-inline list-unstyled">
                                                            <li><p><img src="/img/icons/report_content.svg" alt="">(47) Report Content</p></li>
                                                            <li><p><img src="/img/icons/NO_see.svg" alt="">(0) Block all posts by this user</p></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <!-- MENU RIGHT -->

                            <div class="col-md-3 menu-right">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="row-user-name">
                                                <div class="user-avatar">
                                                    <div class="img-user-avatar"></div>
                                                </div>
                                                <div class="user-data">
                                                    <p class="name">{{ state.author.name }}</p>
                                                    <p class="website">{{ state.author.metadata.web || '-' }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row row-master">
                                        <div class="col-md-6">
                                            <img src="/img/icons/master.svg" alt="">
                                            <p>Master</p>
                                        </div>
                                        <div class="col-md-6">
                                            <img src="/img/icons/buzz.svg" alt="">
                                            <p>385 Buzz</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <a class="btn btn--primary type--uppercase w-100" href="#">
                                            <span class="btn__text">
                                                {{ lang.BUTTON.FOLLOW }}
                                            </span>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <hr>
                                        </div>
                                    </div>
                                    <div class="row row-publish-description">
                                        <div class="col-md-12">
                                            <p class="title">{{ state.post.title }}</p>
                                            <span class="description">{{ state.post.metadata.description }}</span>
                                            <span class="date-publish">Lorem 24 ipsum, 2017</span>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <hr>
                                        </div>
                                    </div>
                                    <div class="row row-publish-tags">
                                        <div class="col-md-12">
                                            <p class="title">TAGS</p>
                                            <span class="description">{{ state.post.metadata.tags.join(', ') || '' }}</span>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <hr>
                                        </div>
                                    </div>
                                    <div class="row row-social">
                                        <div class="col-md-12">
                                            <ul class="ul-social">
                                                <li>
                                                    <img src="/img/icons/like_BLUE.svg" alt="">
                                                    <p>{{ state.post.active_votes.length }} {{ lang.PUBLICATION.LIKES }}</p>
                                                </li>
                                                <li>
                                                    <img src="/img/icons/downloads.svg" alt="">
                                                    <p>0 {{ lang.PUBLICATION.DOWNLOADS }}</p>
                                                </li>
                                                <li>
                                                    <img src="/img/icons/ic_share_black_24px.svg" alt="">
                                                    <p>{{ lang.PUBLICATION.SHARE }}</p>
                                                </li>
                                            </ul>

                                        </div>
                                    </div>
                                    <div class="row row-download">
                                        <div class="col-md-12">
                                            <a class="btn btn--primary type--uppercase w-100" href="#">
                                            <span class="btn__text">
                                                {{ lang.BUTTON.DOWNLOAD }}
                                            </span>
                                            </a>
                                        </div>
                                        <div class="col-md-12 row-format">
                                            <p class="title">{{ lang.PUBLICATION.FORMAT }}</p>
                                            <span class="description">{{ state.post.metadata.download.type || '-' }}</span>
                                        </div>
                                        <div class="col-md-12 row-format">
                                            <p class="title">{{ lang.PUBLICATION.SIZE }}</p>
                                            <span class="description">{{ state.post.metadata.download.size || '-' }}</span>
                                        </div>
                                        <div class="col-md-12 row-format">
                                            <p class="title">{{ lang.PUBLICATION.PRICE }}</p>
                                            <span v-if="state.post.metadata.price === 0" class="description">{{ lang.PUBLICATION.FREE_DOWNLOAD }}</span>
                                            <span v-else class="description">{{ state.post.metadata.price }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
            <!--end of row-->
        </div>
        <!--end of container-->
    </section>


<?php include ('element/footer.php'); ?>