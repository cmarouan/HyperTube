<template>
  <mdb-navbar class="nav-bar" expand="large" dark color="young-1337">
    <mdb-navbar-brand href="/home">
      <!-- class="animated bounce infinite" -->
      <nuxt-link to="/home">
        <img src="~/assets/Hbrand.png" height="50" alt />
      </nuxt-link>
    </mdb-navbar-brand>
    <mdb-navbar-toggler>
      
      <mdb-navbar-nav right>
        <!-- <form @submit.prevent="gotoProfil">
          <mdb-input type="text" class="text-white" placeholder="Search" aria-label="Search"/>
        </form> -->
        <form @submit.prevent="gotoProfil">
            <mdb-input
            class="text-white"
              type="text"
              id="search"
              :placeholder="$t('searchu')"
              v-model="customValues.login"
              :customValidation="validation.login.validated"
              :isValid="validation.login.valid"
              @change="validate('login')"
              validFeedback="login look's good."
              :invalidFeedback="validation.login.invalidFeedback"
            />
        </form>
        <mdb-dropdown style="margin-left: 30px;">
          <mdb-dropdown-toggle class="diskonly profile-icon-toggle" slot="toggle">
            <img
              :src="user.profil ? user.profil : 'http://localhost:3000/default-profile.png'"
              class="rounded-circle z-depth-0"
              alt="avatar image"
              width="60px"
              height="60px"
            />
          </mdb-dropdown-toggle>
          <mdb-dropdown-toggle class="mobileonly profile-icon-toggle" slot="toggle" style="min-width:80px; font-size: 1.5rem; color:white; margin-top: 10px;">{{user.login}}</mdb-dropdown-toggle>

          <mdb-dropdown-menu>
            <mdb-dropdown-item :to="`/profile/${user.login}`">
              <nuxt-link :to="`/profile/${user.login}`" no-prefetch>{{$t('Profile')}}</nuxt-link>
            </mdb-dropdown-item>
            <mdb-dropdown-item to="/settings">
              <nuxt-link to="/settings" no-prefetch>{{$t('Settings')}}</nuxt-link>
            </mdb-dropdown-item>
            <mdb-dropdown-item to="/logout">
              <nuxt-link to="/logout" no-prefetch>{{$t('Log out')}}</nuxt-link>
            </mdb-dropdown-item>
          </mdb-dropdown-menu>
        </mdb-dropdown>
        <h3 class="diskonly" style="min-width:80px; color:white; margin-top: 10px;">{{user.login}}</h3>

      </mdb-navbar-nav>
    </mdb-navbar-toggler>
  </mdb-navbar>
</template>
<script>
import axios from "axios";

export default {
  data: () => {
    return {
      customValues: {
        login: ""
      },
      validation: {
        login: {
          valid: false,
          validated: false,
          invalidFeedback: ""
        }
      },
      userprofil: ""
    };
  },
  computed: {
    user: function() {
      return this.$store.getters.getdata;
    }
  },

  mounted() {
    this.$root.$on("refreshAvatar", () => {
      this.update();
    });
  },
  created() {
    // this.update();
    this.$i18n.locale = this.user.preferedlang;
  },
  methods: {
    gotoProfil() {
      this.isValidForm()
        .then(res => {
          let login = this.customValues.login;
          let input = document.getElementById("search");
          this.customValues.login = "";
          this.validation.login = {};
          input.focus();
          input.blur();
          this.$router.push("/profile/" + login);
        })
        .catch(err => {});
    },
    isValidForm() {
      return new Promise((reject, resolve) => {
        Object.keys(this.validation).forEach(key => {
          if (!this.validation[key].valid) {
            resolve(false);
          }
        });
        reject(true);
      });
    },
    update() {
      this.$axios
        .get(`/api/whoAmi/${localStorage.token}`)
        .then(res => {
          if (res.data.success)
            this.$store.dispatch("getdata", res.data.data.user);
          else
          {
            localStorage.removeItem("token");
            this.$router.push("/login");
          }

        })
        .catch(err => {
          localStorage.removeItem("token");
          this.$router.push("/login");
        });
    },
    validate(key, value) {
      if (key === "login") {
        if (
          !String(this.customValues[key]).match(
            /^[a-zA-Z]+([_-]?[a-zA-Z0-9])*$/g
          ) ||
          this.customValues[key].length > 30 ||
          this.customValues[key].length < 3
        ) {
          this.validation[key].valid = false;
          this.validation[key].invalidFeedback = "Wrong login.";
        } else {
          this.validation[key].valid = true;
        }
        this.validation[key].validated = true;
      }
      this.validation[key].validated = true;
    }
  }
};
</script>
<style scoped>

.nav-bar {
  position: fixed;
  z-index: 1030;
  width: 100%;
}
.profile-icon-toggle {
  box-shadow: none;
  padding: 0px;
}
.md-form {
  position: relative;
  margin: 0px;
}
#selector {
  background-color: #d2c2c200;
  border: red;
  font-size: 45px;
  -webkit-appearance: none;
}

.young-1337 {
  background-image: -webkit-gradient(
    linear,
    left top,
    right top,
    from(#000000),
    color-stop(0%, #271817),
    color-stop(21%, #27181799),
    color-stop(52%, #de1616e0),
    color-stop(78%, #941c1cfa),
    to(#000000)
  );
  background-image: linear-gradient(
    to right,
    #00000069 0%,
    rgba(36, 22, 21, 0.02745) 0%,
    #27181799 21%,
    #de1616e0 52%,
    #941c1cfa 78%,
    #000000 100%
  );
}
@media (max-width: 992px) {
  .diskonly{
    display: none;
  }
  .mobileonly{
    display: unset;
  }
}
@media (min-width: 992px) {
  .diskonly{
    display: unset;
  }
  .mobileonly{
    display: none;
  }
}
</style>