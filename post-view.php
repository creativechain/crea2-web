<?php include ('element/navbar.php'); ?>
<div class="main-container post-view">
    <div id="home-banner">
        <?php include ('modules/banner.php') ?>
    </div>

    <section v-cloak id="post-view">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-11 border-post-view ">
                    <div class="row">
                        <div class="col-md-9 border-box full-post">
                            <div class="row">
                                <div class="col-md-12 img-post-view content-post" >
                                    <template v-for="el in state.post.body">
                                        <div v-if="el.type.indexOf('text/html') > -1" v-html="el.value">

                                        </div>
                                        <div v-else-if="el.type.indexOf('image/') > -1" class="upload-img">
                                            <p>
                                                <img v-bind:src="el.url" v-bind:type="el.type" alt="">
                                            </p>
                                        </div>
                                        <div v-else-if="el.type.indexOf('video/') > -1" class="upload-img">
                                            <p>
                                                <video controls>
                                                    <source v-bind:src="el.url" v-bind:type="el.type">
                                                </video>
                                            </p>
                                        </div>
                                        <div v-else-if="el.type.indexOf('audio/') > -1" class="upload-img">
                                            <p>
                                                <audio controls>
                                                    <source v-bind:src="el.url" v-bind:type="el.type">
                                                </audio>
                                            </p>
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <div class="row row-promote justify-content-center">
                                <div class=" col-md-4">
                                    <a href="#" class="btn btn--transparent ">
                                        <span class="btn__text color--dark">
                                            {{ lang.BUTTON.PROMOTE }}
                                        </span>
                                    </a>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12"><p class="subtitle-content-publish">{{ lang.PUBLICATION.MORE_PROJECTS }}</p></div>
                            </div>
                            <div class="row">
                                <template v-for="o in otherProjects">
                                    <div class="col-md-4">
                                        <div class="img-more-projects"
                                             v-on:click="showPost(o)"
                                             v-bind:style="{ 'background-image': 'url(' + o.metadata.featuredImage + ')' }"></div>
                                    </div>
                                </template>
                            </div>
                            <!--<div class="row">
                                <div class="col-md-12"><p class="subtitle-content-publish">{{ lang.PUBLICATION.YOUR_COMMENTS }}</p></div>
                            </div>-->
                            <div class="row mt--1">
                                <div class="col-md-12">
                                    <p class="subtitle-content-publish">Your comments</p>
                                </div>
                                <div class="col-md-12">
                                    <div class="boxed boxed--border box-comment">
                                        <div v-if="session" class="row">
                                            <div class="col-md-12 row-comment">

                                                <div class="user-avatar">
                                                    <a href="/profile.php">
                                                        <div class="img-user-avatar" v-bind:style="{ 'background-image': 'url(' + (user.metadata.avatar.url || getDefaultAvatar(user.name)) + ')' }"></div>
                                                    </a>
                                                </div>
                                                <div class="textarea">
                                                    <textarea name="text" placeholder="Message" rows="4" v-model="comment"></textarea>
                                                </div>
                                            </div>
                                            <div class="col-md-12 mt--1 text-right">
                                                <a class="btn btn--primary" href="#/" v-on:click="makeComment">
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
                                                            <a v-bind:href="'/profile.php?profile=' + state.content[c].author">
                                                                <div class="img-user-avatar" v-bind:style=" { 'background-image': 'url(' + (state.accounts[state.content[c].author].metadata.avatar.url || getDefaultAvatar(state.accounts[state.content[c].author].name)) +')' }"></div>
                                                            </a>
                                                        </div>
                                                        <div class="user-comments">
                                                            <p>
                                                                <a v-bind:href="'/profile.php?profile=' + state.content[c].author">
                                                                    {{ state.accounts[state.content[c].author].metadata.publicName || state.content[c].author }}
                                                                </a>
                                                                <img src="/img/icons/trainer.svg" alt="">
                                                                <span>{{ dateFromNow(state.content[c].created) }}</span>
                                                            </p>
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
                                                    <li><p><img src="/img/icons/report_content.svg" alt="">(0) Report Content</p></li>
                                                    <li><p><img src="/img/icons/NO_see.svg" alt="">(0) Block all posts by this user</p></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- MENU RIGHT -->

                        <div class="col-md-3 menu-right">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="row-user-name">
                                        <div class="user-avatar">
                                            <a v-bind:href="'/profile.php?profile=' + state.author.name">
                                                <div class="img-user-avatar" v-bind:style=" { 'background-image': 'url(' + (state.author.metadata.avatar.url || getDefaultAvatar(state.author.name)) +')' }"></div>
                                            </a>
                                        </div>
                                        <div class="user-data">
                                            <a v-bind:href="'/profile.php?profile=' + state.author.name">
                                                <p class="name">{{ state.author.metadata.publicName || state.author.name }}</p>
                                            </a>
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
                                <div class="col-md-12 text-center">
                                    <btn-follow v-if="session" class="" v-on:follow="onFollow" v-bind:self="session" v-bind:user="state.post.author" v-bind:following="false" ></btn-follow>
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
                                    <p class="date-publish description">{{ formatDate(state.post.created) }}</p>
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

                            <div class="row row-social">
                                <div class="col-md-12">
                                    <ul class="ul-social">
                                        <hr>
                                        <li>
                                            <div class="row-likes">
                                                <div class="col-likes">
                                                    <img src="/img/icons/like_BLUE.svg" alt="">
                                                    <p>{{ state.post.active_votes.length }} {{ lang.PUBLICATION.LIKES }}</p>
                                                </div>
                                                <div class="col-amount">
                                                    <span>14,84 $</span>
                                                </div>
                                            </div>


                                        </li>
                                        <hr>
                                        <li>
                                            <img src="/img/icons/downloads.svg" alt="">
                                            <p>0 {{ lang.PUBLICATION.DOWNLOADS }}</p>
                                        </li>
                                        <hr>
                                        <li>
                                            <img src="/img/icons/ic_share_black_24px.svg" alt="">
                                            <p>{{ lang.PUBLICATION.SHARE }}</p>
                                        </li>
                                        <hr>
                                    </ul>

                                </div>
                            </div>
                            <div class="row row-download">
                                <div class="col-md-12 text-center">
                                    <a class="btn btn--primary" href="#">
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
            <!--end of row-->
        </div>
        <!--end of container-->
    </section>
    <script src="/js/common/post.js"></script>

<?php include ('element/footer.php'); ?>