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
                            <div v-if="session" class="row row-promote justify-content-center">
                                <div class=" col-md-4 text-center">
                                    <div class="modal-instance">

                                        <a href="#modal-promote" class="btn btn--transparent modal-trigger">
                                            <span class="btn__text color--dark">
                                                {{ lang.BUTTON.PROMOTE }}
                                            </span>
                                        </a>

                                        <div v-cloak id="modal-promote" data-modal-id="modal-promote" class="modal-container">
                                            <div class="modal-content section-modal">
                                                <section class="unpad ">
                                                    <div class="container">
                                                        <div class="row justify-content-center">
                                                            <div class="col-lg-6 col-md-8 col-sm-12">
                                                                <div class="feature feature-1">
                                                                    <div class="feature__body boxed boxed--lg boxed--border">
                                                                        <div class="modal-close modal-close-cross"></div>
                                                                        <div class="text-block">
                                                                            <h3>{{ lang.PUBLICATION.PROMOTE_TITLE }}</h3>
                                                                            <p>{{ lang.PUBLICATION.PROMOTE_TEXT }}</p>
                                                                        </div>
                                                                        <form>
                                                                            <div class="row">
                                                                                <div class="col-md-12">
                                                                                    <p class="text-p-form">{{ lang.MODAL.WALLET_AMOUNT }}</p>
                                                                                </div>
                                                                                <div class="col-md-6">
                                                                                    <div class="input-icon input-icon--right">
                                                                                        <i class="">CBD ($)</i>
                                                                                        <input v-model="amount" type="number" step="0.001" name="input" >
                                                                                        <p class="amount-save mt-4" >{{ lang.WALLET.BALANCE }}: {{ user.cbd_balance }}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="row mt-3">
                                                                                <div class="col text-right">
                                                                                    <a href="#0" v-on:click="makePromotion" class="btn btn--sm btn--primary type--uppercase" >
                                                                                        <span class="btn__text">{{ lang.BUTTON.PROMOTE }}</span>
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                            <!--end of row-->
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                                <!--end feature-->
                                                            </div>
                                                        </div>
                                                        <!--end of row-->
                                                    </div>
                                                    <!--end of container-->
                                                </section>
                                            </div>
                                        </div>
                                    </div>
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
                                    <p class="subtitle-content-publish">{{ lang.PUBLICATION.COMMENTS }}</p>
                                </div>
                                <div class="col-md-12">
                                    <div class="boxed boxed--border box-comment">
                                        <div v-if="session" class="row">
                                            <div class="col-md-12 row-comment">

                                                <div class="user-avatar">
                                                    <a v-bind:href="'/@' + user.name">
                                                        <avatar v-bind:account="user"></avatar>
                                                    </a>

                                                </div>
                                                <div class="textarea">
                                                    <textarea name="text" placeholder="Message" rows="4" v-model="comment"></textarea>
                                                </div>
                                            </div>
                                            <div class="col-md-12 mt--1 text-right">
                                                <div class="btn btn--primary" v-on:click="makeComment">
                                                    <span class="btn__text">
                                                        {{ lang.BUTTON.POST_COMMENT }}
                                                    </span>
                                                </div>
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
                                                            <a v-bind:href="'/@' + state.content[c].author">
                                                                <avatar v-bind:account="state.accounts[state.content[c].author]"></avatar>
                                                            </a>
                                                        </div>
                                                        <div class="user-comments">
                                                            <p>
                                                                <username v-bind:inline="1" v-bind:user="state.content[c].author" v-bind:name="state.accounts[state.content[c].author].metadata.publicName"></username>
                                                                <img src="/img/icons/trainer.svg" alt="">
                                                                <span>{{ dateFromNow(state.content[c].created) }}</span>
                                                            </p>
                                                            <span class="comment-user">{{ state.content[c].body }}</span>
                                                            <div class="row">
                                                                <div class="col-md-12">
                                                                    <ul class="list-inline list-unstyled ul-row-share-comment">
                                                                        <li>
                                                                            <comment-like v-on:vote="onVote" v-bind:session="session" v-bind:post="state.content[c]"></comment-like>
<!--                                                                            <div class="cursor" v-on:click="makeVote(state.content[c])"><img src="/img/icons/like.svg" alt="">{{ state.content[c].active_votes.length }}</div></li>-->
                                                                        <li><p>{{ state.content[c].pending_payout_value }}</p></li>
                                                                        <li class="hidden" v-if="session"><p>{{ lang.PUBLICATION.COMMENT }}</p></li>
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
                                                        <p>
                                                            License: <a v-bind:href="getLicense().getLink()">{{ getLicense().getTags() }}</a>
                                                        </p>
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
                                    <div v-if="!isSameUser()" class="boxed boxed--border box-report">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <ul class="list-inline list-unstyled">
                                                    <li v-if="isReportedByUser()" class="cursor" v-on:click="vote(0)"><p><img src="/img/icons/report_content.svg" alt="">({{ state.post.down_votes.length }}) {{ lang.PUBLICATION.REMOVE_REPORT }}</p></li>
                                                    <li v-else class="cursor" v-on:click="vote(-10000)"><p><img src="/img/icons/report_content.svg" alt="">({{ state.post.down_votes.length }}) {{ lang.PUBLICATION.REPORT_CONTENT }}</p></li>
                                                    <li class="cursor" v-on:click="ignoreUser"><p><img src="/img/icons/NO_see.svg" alt="">() Block all posts by this user</p></li>
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
                                            <a v-bind:href="'/@' + state.author.name">
                                                <avatar v-bind:account="state.author"></avatar>
                                            </a>
                                        </div>
                                        <div class="user-data">
                                            <username class="name color--link" v-bind:inline="1" v-bind:user="state.author.name" v-bind:name="state.author.metadata.publicName"></username>
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
                            <div v-if="!isSameUser()" class="row">
                                <div class="col-md-12 text-center">
                                    <btn-follow v-if="session"
                                                v-on:follow="onFollow" v-bind:session="session"
                                                v-bind:account="user"
                                                v-bind:user="state.post.author" >

                                    </btn-follow>
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
                                    <p class="date-publish description mt-4">{{ formatDate(state.post.created) }}</p>
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
                                    <div v-html="getLinkedTags(true)"></div>

                                </div>
                            </div>

                            <div class="row row-social">
                                <div class="col-md-12">
                                    <ul class="ul-social">
                                        <hr>
                                        <li>
                                            <div class="row-likes">
                                                <post-like v-on:vote="onVote" v-bind:session="session" v-bind:post="state.post"></post-like>
                                                <div class="col-amount">
                                                    <span>{{ getPayout() }}</span>
                                                </div>
                                            </div>


                                        </li>
                                        <hr>
                                        <li>
                                            <img src="/img/icons/downloads.svg" alt="">
                                            <p>{{ state.post.download.times_downloaded }} {{ lang.PUBLICATION.DOWNLOADS }}</p>
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
                                <div v-if="session" class="col-md-12 text-center">
                                    <a class="btn btn--primary" href="#" v-on:click="makeDownload">
                                        <span class="btn__text">
                                            {{ lang.BUTTON.DOWNLOAD }}
                                        </span>
                                    </a>
                                </div>
                                <div class="col-md-12 row-format">
                                    <p class="title">{{ lang.PUBLICATION.FORMAT }}</p>
                                    <span class="description">{{ state.post.download.type }}</span>
                                </div>
                                <div class="col-md-12 row-format">
                                    <p class="title">{{ lang.PUBLICATION.SIZE }}</p>
                                    <span class="description">{{ humanFileSize(state.post.download.size) }}</span>
                                </div>
                                <div class="col-md-12 row-format">
                                    <p class="title">{{ lang.PUBLICATION.PRICE }}</p>
                                    <span v-if="state.post.download.price.amount === 0" class="description">{{ lang.PUBLICATION.FREE_DOWNLOAD }}</span>
                                    <span v-else class="description">{{ assetToString(state.post.download.price) }}</span>
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