<?php include ('element/navbar.php'); ?>
<div class="main-container">
    <section id="tags-explorer" class="space--sm">
        <div v-cloak class="container post-container-home">
            <div class="row">
                <div class="col-md-12">
                    <h3 class="title-explorer">{{ lang.TRENDING.TITLE }}</h3>
                </div>
            </div>
            <table class="border--round table--alternate-row text-right">
                <thead>
                <tr>
                    <th>{{ lang.TRENDING.TAGS }}</th>
                    <th>{{ lang.TRENDING.POSTS }}</th>
                    <th>{{ lang.TRENDING.COMMENTS }}</th>
                    <th>{{ lang.TRENDING.PAYOUTS }}</th>
                </tr>
                </thead>
                <tbody>
                <template v-for="t in Object.keys(state.tags)">
                        <tr>
                            <td>{{ state.tags[t].name }}</td>
                            <td>{{ state.tags[t].top_posts }}</td>
                            <td>{{ state.tags[t].comments }}</td>
                            <td>{{ state.tags[t].total_payouts }}</td>
                        </tr>
                </template>
                </tbody>
            </table>
        </div>
    </section>
    <script src="/js/common/tags.js"></script>


<?php include ('element/footer.php'); ?>