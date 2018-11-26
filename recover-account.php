<?php include ('element/navbar.php'); ?>
<div class="main-container view-recorver-account">
    <section class="space--sm">
        <div class="container post-container-home">
            <div class="col-md-8 offset-2">
                <div class="row">
                    <div class="col-md-12">
                        <h3 class="title-explorer">Recuperar contraseña </h3>
                    </div>
                </div>
                <form class="row">
                    <div class="col-md-12">
                        <p class="lead">If someone manages to hack your account by accessing the place where you saved your password, he could change it and prevent access to the original owner of the account.</p>
                        <p class="lead">The blockchain of Crea incorporates a system for recovering stolen accounts. If your password has been changed without your consent, then the account designated as your recovery account can generate a new owner key for the account.</p>
                        <p class="lead">This recovery process must be completed within 30 days after the password is modified, and the user must provide a recent owner key that has been valid in the last 30 days.</p>
                        <p class="lead">This functionality can only be used in creary.net as long as the owner of the account has included Creary as his trusted account and has also accepted the terms and conditions of service of Creary.net.</p>
                    </div>
                    <div class="col-md-12 mt-4">
                        <label class="lead mb-0">Your Name:</label>
                        <input type="text" name="name" placeholder="First / Last Name" class="validate-required">
                    </div>
                    <div class="col-md-12">
                        <label class="lead mb-0">Email Address:</label>
                        <input type="email" name="email" placeholder="you@something.com" class="validate-required">
                    </div>
                    <div class="col-md-12 mt-3">
                        <a id="welcome-slide1-button-signup" href="#" class="btn btn--primary">
                            <span class="btn__text">
                                Sign up
                            </span>
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </section>

<?php include ('element/footer.php'); ?>