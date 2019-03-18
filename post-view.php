<?php include ('element/navbar.php'); ?>
<div class="main-container post-view">
    <section v-cloak id="post-view">
        <div class=" border-post-view">

            <div class="container" style="background-color: white;border-radius: 10px 10px;">
                <div class="row row-title">
                    <div class="col-12 col-sm-12 col-md-6">
                        <div class="row-user-name">
                            <div class="user-avatar">
                                <a v-bind:href="'/@' + state.author.name">
                                    <avatar v-bind:account="state.author"></avatar>
                                </a>
                            </div>
                            <div class="user-data">
                                <h3 class="mb-0 text-truncate title">{{ state.post.title }}</h3>
                                <username class="name color--link" v-bind:inline="1" v-bind:user="state.author.name" v-bind:name="state.author.metadata.publicName"></username>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-sm-12 col-md-6 text-right mt-3 mb-3 mb-md-0 mt-md-0">
                        <ul class="stats-post">
                            <li class="list-inline-item">
                                <btn-follow v-if="session && !isSameUser()"
                                            v-on:follow="onFollow" v-bind:session="session"
                                            v-bind:account="user"
                                            v-bind:user="state.post.author" >

                                </btn-follow>
                                <div v-else-if="session" class="btn btn--primary" v-on:click="editPost()">
                                    <span class="btn__text">
                                        {{ lang.BUTTON.EDIT_POST }}
                                    </span>
                                </div>
                            </li>
                            <li class="ul-social list-inline-item">
                                <div class="row-likes">
                                    <div class="d-flex w-100">
                                        <div class="">
                                            <post-like v-on:vote="onVote" v-bind:session="session" v-bind:post="state.post"></post-like>
                                        </div>
                                    </div>
                                </div>

                            </li>
                            <li class="list-inline-item">
                                <div class="dropdown dropdown-price">
                                        <span class="dropdown__trigger"> {{ getPayout() }}
                                            <i class="stack-down-open"></i>
                                        </span>
                                    <div class="dropdown__container price">
                                        <div class="">
                                            <div class="row">
                                                <div class="col-12 col-sm-12 col-md-12 dropdown__content amount-post-view-home">
                                                    <p class="title">{{ hasPaid() ? lang.HOME.DROPDOWN_PAST_PAYOUT : lang.HOME.DROPDOWN_PENDING_PAYOUT}} {{ getPayout() }}</p>
                                                    <p v-if="!hasPaid()">{{ getPendingPayouts() }}</p>
                                                    <p>{{ getPayoutPostDate() }}</p>
                                                    <p v-if="hasPromotion()">{{ lang.HOME.PROMOTION_COST }}: {{ getPromotion() }}</p>
                                                </div>
                                            </div><!--end row-->
                                        </div><!--end container-->
                                    </div><!--end dropdown container-->
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="container"  style="background-color: white">
                <div class="row background-content-post row-content-post">
                    <div class="col-md-12 img-post-view content-post" >
                        <template v-for="el in state.post.body">
                            <div v-if="el != null">
                                <div v-if="el.type.indexOf('text/html') > -1" v-html="el.value" style="word-break: break-word;">

                                </div>
                                <div v-else-if="el.type.indexOf('image/') > -1" class="upload-img">
                                    <p>
                                        <img v-bind:src="el.url" v-bind:type="el.type" alt="" />
                                    </p>
                                </div>
                                <div v-else-if="el.type.indexOf('video/') > -1" class="upload-img">
                                    <p>
                                        <video controls >
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
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <div class="container row-promoter pt-3 pb-3" style="background-color: white">
                <div class="row justify-content-between">
                    <div class="col">
                        <!--<img src="/img/icons/ic_share_black_24px.svg" alt="">-->
                    </div>
                    <div class="col text-right">
                        <div v-if="session" class="row-promote justify-content-center">
                            <div class="modal-instance">

                                <a href="#modal-promote" class="btn btn--transparent modal-trigger">
                                            <span class="btn__text color--dark">
                                                {{ lang.BUTTON.PROMOTE }}
                                            </span>
                                </a>

                                <div v-pre>
                                    <div v-cloak id="modal-promote" data-modal-id="modal-promote" class="modal-container">
                                        <div class="modal-content section-modal">
                                            <section class="unpad ">
                                                <div class="container">
                                                    <div class="row">
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
                                                                                    <input v-model="amount" type="number" step="0.001" name="input" />
                                                                                    <p class="amount-save mt-4" >{{ lang.WALLET.BALANCE }}: {{ user.cbd_balance }}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row mt-3">
                                                                            <div class="col text-right">
                                                                                <div v-on:click="makePromotion" class="btn btn--sm btn--primary" >
                                                                                    <span class="btn__text">{{ lang.BUTTON.PROMOTE }}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="container row-project">
                <div class="row">
                    <div class="col-md-12"><p class="subtitle-content-publish">{{ lang.PUBLICATION.MORE_PROJECTS }}</p></div>
                </div>

                <div v-pre class="row">
                    <div id="more-projects" class="col">
                        <div class="slider slider--columns" data-autoplay="false">
                            <ul class="slides">
                                <li v-for="o in otherProjects" class="col-6 col-sm-6 col-md-4 mb-2">
                                    <a v-bind:href="o.url">
                                        <div class="img-more-projects"
                                             v-on:click="showPost(o)"
                                             v-bind:style="{ 'background-image': 'url(' + getFeaturedImage(o).url + ')' }"></div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--end of col-->
                </div>
            </div>

            <div class="container row-title-comment">
                <div class="row">
                    <div class="col-md-12">
                        <p class="subtitle-content-publish mb-0">{{ lang.PUBLICATION.COMMENTS }}</p>
                    </div>
                </div>
            </div>

            <div class="container row-comment-options">
                <div class="row">
                    <div class="col-md-7">
                        <div class="boxed boxed--border box-comment mb-0 mt-3">
                            <div v-if="session" class="row">
                                <div class="col-md-12 row-comment">

                                    <div class="user-avatar">
                                        <a v-bind:href="'/@' + user.name">
                                            <avatar v-bind:account="user"></avatar>
                                        </a>

                                    </div>
                                    <div class="textarea">
                                        <textarea name="text" placeholder="Message" rows="4" v-model="comment" v-bind:maxlength="CONSTANTS.TEXT_MAX_SIZE.COMMENT"></textarea>
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

                            <hr />

                            <div class="row">
                                <div class="col-md-12">
                                    <h3 class="title">{{ lang.PUBLICATION.COMMENTS + ' (' + state.post.children + ')' }}</h3>
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
                                                    <span>{{ dateFromNow(state.content[c].created) }}</span>
                                                </p>
                                                <p class="comment-user">{{ state.content[c].body }}</p>
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <ul class="list-inline list-unstyled ul-row-share-comment">
                                                            <li>
                                                                <comment-like v-on:vote="onVote" v-bind:session="session" v-bind:post="state.content[c]"></comment-like>
                                                                <!--                                                                            <div class="cursor" v-on:click="makeVote(state.content[c])"><img src="/img/icons/like.svg" alt="">{{ state.content[c].active_votes.length }}</div></li>-->
                                                            <li><p>{{ getPayout(state.content[c]) }}</p></li>
                                                            <li class="hidden" v-if="session"><p>{{ lang.PUBLICATION.COMMENT }}</p></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>


                            <hr />

                            <div class="row">
                                <div class="col-md-12 text-center">
                                    <a href="" class="more-comments">{{ lang.PUBLICATION.MORE_COMMENTS }}</a>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-12">
                                <div v-if="!isSameUser()" class="boxed boxed--border box-report">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <ul class="list-inline list-unstyled">

                                                <li v-if="state.post.reported" class="cursor-link" v-on:click="vote(0)"><p class="p-report link-report"><img src="/img/icons/report_content.svg" alt="" />({{ state.post.down_votes.length }}) {{ lang.PUBLICATION.REMOVE_REPORT }}</p></li>
                                                <li v-else >
                                                    <div class="modal-instance ">
                                                        <p class="p-report">
                                                            <img src="/img/icons/report_content.svg" alt="" />({{ state.post.down_votes.length }})
                                                            <a href="#modal-report" class="modal-trigger link-report">{{ lang.PUBLICATION.REPORT_CONTENT }}</a>
                                                        </p>

                                                        <div id="modal-report" data-modal-id="modal-report" class="modal-container modal-report">
                                                            <div class="modal-content">
                                                                <section class="unpad ">
                                                                    <div class="container">
                                                                        <div class="row justify-content-center">
                                                                            <div class="col-md-6">
                                                                                <div class="boxed boxed--lg bg--white feature">
                                                                                    <div class="modal-close modal-close-cross"></div>
                                                                                    <h3>{{ lang.PUBLICATION.MODAL_REPORT_TITLE }}</h3>
                                                                                    <div class="feature__body">
                                                                                        <p class="mb-0">{{ lang.PUBLICATION.MODAL_REPORT_HEAD1 }}</p>
                                                                                        <p>{{ lang.PUBLICATION.MODAL_REPORT_HEAD2 }}</p>
                                                                                        <ul>
                                                                                            <li><p>- {{ lang.PUBLICATION.MODAL_REPORT_REASON1 }}</p></li>
                                                                                            <li><p>- {{ lang.PUBLICATION.MODAL_REPORT_REASON2 }}</p></li>
                                                                                            <li><p>- {{ lang.PUBLICATION.MODAL_REPORT_REASON3 }}</p></li>
                                                                                            <li><p>- {{ lang.PUBLICATION.MODAL_REPORT_REASON4 }}</p></li>
                                                                                        </ul>
                                                                                        <p>{{ lang.PUBLICATION.MODAL_REPORT_FOOTER }}</p>
                                                                                    </div>
                                                                                    <div class="row mt-3">
                                                                                        <div class="col-md-12 text-right">
                                                                                            <div class="btn btn--primary modal-close" v-on:click="vote(-10000)">
                                                                                                    <span class="btn__text">
                                                                                                        {{ lang.BUTTON.REPORT }}
                                                                                                    </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>

                                                <li class="cursor-link" v-on:click="ignoreUser"><p class="p-report link-report"><img src="/img/icons/NO_see.svg" alt="" />{{ lang.PUBLICATION.BLOCK_USER }}</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                    <div class="col-md-5">
                        <div v-if="state.post.download.resource" class="boxed boxed--border box-comment  mt--2 mt-3">
                            <div class="row row-download">
                                <div class="col-md-12 row-format mt-0">
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
                                <div class="borderHr"></div>
                                <div class="col-md-12">
                                    <ul class="ul-downloads">
                                        <div v-if="state.post.download.resource">
                                            <li v-if="state.post.download.resource">
                                                <img src="/img/icons/downloads.svg" alt="" />
                                                <p>{{ state.post.download.times_downloaded }} {{ lang.PUBLICATION.DOWNLOADS }}</p>
                                            </li>
                                        </div>
                                    </ul>
                                </div>

                                <div class="borderHr"></div>


                                <div v-if="session" class="col-md-12 text-center mt-3">
                                    <div class="modal-instance">
                                        <a href="#modal-download" class="btn btn--primary modal-trigger">
                                            <span class="btn__text">
                                                {{ lang.BUTTON.DOWNLOAD }}
                                            </span>
                                        </a>

                                        <div v-pre>
                                            <div id="modal-download" data-modal-id="modal-download" class="modal-container">
                                                <div class="modal-content section-modal">
                                                    <section class="unpad ">
                                                        <div class="container">
                                                            <div class="row justify-content-center">
                                                                <div class="col-lg-6 col-md-8 col-sm-12 m-0-auto">
                                                                    <div class="feature feature-1">
                                                                        <div class="feature__body boxed boxed--lg boxed--border">
                                                                            <div class="modal-close modal-close-cross" v-on:click="cancelPay"></div>
                                                                            <div class="text-block">
                                                                                <h3>{{ lang.PUBLICATION.MODAL_DOWNLOAD_TITLE }}</h3>
                                                                                <p>{{ modal.alreadyPayed ? lang.PUBLICATION.MODAL_DOWNLOAD_TEXT_PAYED : lang.PUBLICATION.MODAL_DOWNLOAD_TEXT }}</p>
                                                                            </div>
                                                                            <form>
                                                                                <div v-if="!modal.alreadyPayed" class="row">
                                                                                    <div class="col-md-12">
                                                                                        <p class="text-p-form">{{ lang.MODAL.WALLET_AMOUNT }}</p>
                                                                                    </div>
                                                                                    <div class="col-md-6">
                                                                                        <div class="input-icon input-icon--right">
                                                                                            <i class="">{{ modal.symbol }}</i>
                                                                                            <input disabled v-model="modal.amount" type="number" step="0.001" name="input" />
                                                                                            <p class="amount-save mt-4" >{{ lang.WALLET.BALANCE }}: {{ modal.balance }}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="row mt-3">
                                                                                    <div class="col text-right">
                                                                                        <div v-if="modal.confirmed" class="btn btn--sm modal-close"
                                                                                             v-on:click="cancelPay">
                                                                                            <span class="btn__text text__dark">{{ lang.BUTTON.CANCEL}}</span>
                                                                                        </div>
                                                                                        <div v-if="modal.alreadyPayed" v-on:click="confirmDownload" class="btn btn--sm btn--primary modal-close" >
                                                                                            <span class="btn__text">{{ lang.BUTTON.DOWNLOAD }}</span>
                                                                                        </div>
                                                                                        <div v-else v-on:click="confirmDownload" class="btn btn--sm btn--primary" >
                                                                                            <span class="btn__text">{{ modal.confirmed ? lang.BUTTON.PAY : lang.BUTTON.CONFIRM }}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </form>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="boxed boxed--border box-comment  mt--2">
                            <div class="row row-publish-tags">
                                <div class="col-md-12">
                                    <p class="title mb-0">TAGS</p>
                                    <div v-html="getLinkedTags(true)"></div>
                                </div>
                            </div>
                        </div>

                        <div class="boxed boxed--border box-comment  mt--2">
                            <div class="row row-publish-description">
                                <div class="col-md-12">
                                    <p class="title">{{ state.post.title }}</p>
                                    <span class="description">{{ state.post.metadata.description }}</span>
                                    <p class="date-publish description mt-4">{{ formatDate(state.post.created) }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="boxed boxed--border box-blockchain-certificate pt-3">
                            <img class="certificat-flag" src="/img/crea-web/publish/flag.png" alt="" />
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="feature feature-2">
                                        <div class="feature__body">
                                            <h2 class="title-certificate">{{ lang.PUBLICATION.CERTIFICATE }}</h2>
                                            <hr>
                                            <p>License: <a v-bind:href="getLicense().getLink()">{{ getLicense().getTags() }}</a></p>
                                            <p>Timestamp: {{ new Date(state.post.created).toLocaleString() }}</p>
                                            <p>{{ state.post.metadata.hash || '-' }}</p>
                                            <ul class="float-left mt-3">
                                                <li class="li-blockchain-certificate">
                                                    <template v-for="i in getLicense().getIcons('white')">
                                                        <img v-bind:src="i" alt="" />
                                                    </template>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="button-like" class="position-circle-fixed">
                <post-like-big v-on:vote="onVote"
                               v-bind:session="session"
                               v-bind:post="state.post"
                               v-bind:payouts="getPendingPayouts()">

                </post-like-big>
            </div>


        </div>
    </section>
    <script src="/js/common/post.js"></script>

<?php include ('element/footer.php'); ?>