(function () {
    //no arrow func, no let, no const, no ES6, no destructuring, spreading...
    //Thus, we are going to use the promisses.  
    //how to render a component will go here:
    Vue.component("first", {
        template: "#first",
        props: ["id"], // value is always an array. ,"title", "description", "username", "url"
        data: function () {
            return {
                heading: "components components...",
                comments: [],
                title: "",
                description: "",
                username: "",
                file: null,
                id: null,
                comment: "",
                name: "",
            };
        },
        mounted: function () {
            //console.log("component has mounted");
            //console.log("this in component :", this);
            //console.log("this.id", this.id); // working
            var that = this;
            //axios to make a req to the server to get some data:
            axios.get("/images/" + this.id).then(function (resp) {
                // console.log("response from post image", resp);
                // console.log("resp.data.img", resp.data.img);
                var image = resp.data.img;
                var comments = resp.data.comments;
                console.log("we are here", comments);
                that.id = image.id;
                that.url = image.url;
                //console.log("this.url", this.url);
                that.title = image.title;
                that.username = image.username;
                that.description = image.description;
                that.comments = comments;
                console.log("that here", that);
            }).catch(function (err) {
                console.log("error in axios GET images/id", err);
            });
        },
        methods: {
            handleClick: function (e) {
                e.preventDefault();
                console.log("this.name", this.name);
                console.log("this.comment", this.comment);
                var message = {
                    name: this.name,
                    comment: this.comment,
                    image_id: this.id,
                }
                //console.log("message :", message);
                axios.post("/comment", message).then(function (resp) {
                    console.log("response", resp);
                }).catch(function (err) {
                    console.log("error in axios post comment", err);
                });
            },

            closeClick: function (e) {
                e.preventDefault();
                console.log("you are trying to close me!");
                this.$emit('close');
                // an X button =  this.$emit ; showModal set to false in Vue instance
            },
        },
    });

    // a constructor called vue:
    new Vue({
        el: "main",
        data: {
            // props - just like React
            images: [],
            //values of input field:
            title: "",
            description: "",
            username: "",
            file: null,
            id: null,
            showModal: false,
        },
        mounted: function () {
            //lifecycle method
            //mounted is a function that runs after HTML has been rendered (only runs once)
            //when I want to render data from database the moment the page loads = answer is mounted"
            // $.ajax() - we have to find a way to do this without jquery. answer - use axios (we already have a link in our html)

            //console.log("this", this); //this refers to vue, but it will absolutelly different than the one in a nested scope = look_down
            //that is why we create a variable "that" for "this" outside of nested scope: "that" variable will not change it's value like "this" do
            var that = this;
            axios.get("/images").then(function (resp) {
                // resp = response from the server
                //console.log("resp", resp.data.images); //resp has a property data that we have _up
                // console.log("this", this); // it's stops refering to vue and starts refering to a window and stops being useful in nested functions. refers to a global orject instead of vue
                //console.log("that :", that);
                that.images = resp.data.images;
            }).catch(function (err) {
                console.log("err in axios GET script.js", err);
            });
        },
        methods: {
            handleClick: function (e) {
                e.preventDefault();
                //console.log("this : ", this);
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                axios.post("/upload", formData).then(function (resp) {

                    console.log("response from formData", resp);
                }).catch(function (err) {
                    console.log("error in axios post", err);
                });
            },
            handleChange: function (e) {
                //console.log("handle change is running");
                console.log("e.target.files[0]", e.target.files[0]);
                this.file = e.target.files[0];
            },
            handleClickBig: function (id) {
                //console.log("handleClickBig!!!");
                // get image id:
                this.id = id;

                // axios.get("/images/" + this.id).then(function (resp) {
                //     // console.log("response from post image", resp);
                //     // console.log("resp.data.img", resp.data.img);
                //     //console.log("this", this);
                //     var image = resp.data.img;
                //     var comments = resp.data.comments;
                //     that.id = image.id;
                //     that.url = image.url;
                //     that.title = image.title;
                //     that.username = image.username;
                //     that.description = image.description;
                //     that.comments = comments;
                // }).catch(function (err) {
                //     console.log("error in axios GET images/id", err);
                // });

                this.showModal = true;
            },

            closeModal: function () {
                console.log("message from main view instance modal wants to be closed")
                this.showModal = false;
            },
        },
    });
})();