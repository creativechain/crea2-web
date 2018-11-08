<?php include ('element/navbar.php'); ?>
<div v-cloak id="witness-container" class="main-container">
    <section id="view-explorer" class="space--sm">
        <div class="container post-container-home">
            <div class="row">
                <div class="col-md-12">
                    <h3 class="title-explorer">{{ lang.WITNESS.VOTE_TITLE }}</h3>
                </div>
            </div>
            <table class="border--round table--alternate-row table-vote">
                <thead>
                <tr>
                    <th></th>
                    <th>{{ lang.WITNESS.VOTE_WITNESSES }}</th>
                    <th>{{ lang.WITNESS.VOTE_INFORMATION }}</th>
                </tr>
                </thead>
                <tbody>
                <template v-for="x in state.ordered_witnesses">
                    <tr>
                        <td>
                            <p>{{ state.ordered_witnesses.indexOf(x) + 1 }}
                                <img src="img/icons/like_BLUE.svg" alt="">
                            </p>
                        </td>
                        <td>{{ x }}</td>
                        <td><a v-bind:href="state.witnesses[x].url"></a> </td>
                    </tr>
                </template>

                </tbody>
            </table>
        </div>
    </section>



<?php include ('element/footer.php'); ?>