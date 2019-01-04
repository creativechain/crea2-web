<div class="col-md-12">
    <h4>{{ lang.EDIT_PROFILE.SECTION_TITLE }}</h4>
</div>
<div class="col-md-12">
    <div id="profile-edit" class="boxed boxed--sm boxed--border">
        <div class="row">
            <div class="col-md-12 row-flex">
                <avatar class="user-avatar size-25-avatar" v-bind:account="state.user"></avatar>
                <div class="col-info-user">
                    <span class="h5">{{ profile.publicName || ''}}</span>
                    <p class="mb-2 nameUser">{{ '@' + state.user.name }}</p>
                    <a href="" v-on:click="loadAvatar">{{ lang.EDIT_PROFILE.CHANGE_IMAGE }}</a>
                    <input id="profile-edit-input-avatar" class="hidden" type="file" accept="image/*" v-on:change="onLoadAvatar" />
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <label>{{ lang.EDIT_PROFILE.PUBLIC_NAME }}</label>
                <input class="validate-required" type="text" v-bind:maxlength="CONSTANTS.TEXT_MAX_SIZE.PROFILE.PUBLIC_NAME"
                       v-model="profile.publicName"
                       v-bind:placeholder="lang.EDIT_PROFILE.INPUT_PUBLIC_NAME"/>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <label>{{ lang.EDIT_PROFILE.ABOUT }}</label>
                <input class="validate-required" type="text" v-bind:maxlength="CONSTANTS.TEXT_MAX_SIZE.PROFILE.ABOUT"
                       v-model="profile.about"
                       v-bind:placeholder="lang.EDIT_PROFILE.INPUT_ABOUT" />
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <label>WEB</label>
                <input class="validate-required" type="text" v-bind:maxlength="CONSTANTS.TEXT_MAX_SIZE.PROFILE.WEB"
                       v-model="profile.web"
                       v-bind:placeholder="lang.EDIT_PROFILE.INPUT_WEBSITE" />
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <label>{{ lang.EDIT_PROFILE.CONTACT_INFO }}</label>
                <input class="validate-required" type="text" v-bind:maxlength="CONSTANTS.TEXT_MAX_SIZE.PROFILE.CONTACT"
                       v-model="profile.contact"
                       v-bind:placeholder="lang.EDIT_PROFILE.INPUT_CONTACT_INFO" />
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <label>{{ lang.EDIT_PROFILE.TAGS }}</label>
                <input id="profile-edit-tags" class="validate-required" data-role="tagsinput"
                       v-bind:placeholder="lang.EDIT_PROFILE.INPUT_TAGS" />
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <label>{{ lang.EDIT_PROFILE.LANGUAGE }}</label>
                <div class="input-select">
                    <select>
                        <option selected="" value="Default">Selecciona idioma</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Larger">Large</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <label>{{ lang.EDIT_PROFILE.ADULT_CONTENT }}</label>
                <div class="input-select">
                    <select>
                        <option selected="" value="Default">Selecciona contenido</option>
                        <option value="Small">Ocultar</option>
                        <option value="Medium">Advertir</option>
                        <option value="Larger">Mostrar</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <label>{{ lang.EDIT_PROFILE.POST_REWARDS }}</label>
                <div class="input-select">
                    <select>
                        <option selected="" value="Default">Selecciona recompensa publicación</option>
                        <option value="Small">Rechazar pago</option>
                        <option value="Medium">50% - 50%</option>
                        <option value="Larger">Energize 100%</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <label>{{ lang.EDIT_PROFILE.COMMENT_REWARDS }}</label>
                <div class="input-select">
                    <select>
                        <option selected="" value="Default">Selecciona recompensa comentario</option>
                        <option value="Small">Rechazar pago</option>
                        <option value="Medium">50% - 50%</option>
                        <option value="Larger">Energize 100%</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <a class="btn btn--sm btn--primary" href="#0" v-on:click="sendAccountUpdate">
                <span class="btn__text">
                    {{ lang.BUTTON.SAVE }}
                </span>
                </a>
            </div>
        </div>
    </div>
</div>
