(function () {
    //no arrow func, no let, no const, no ES6, no destructuring, spreading...
    //Thus, we are going to use the promisses.  
    //how to render a component will go here:
    Vue.component("first", {
        template: "#first",
        props: ["imageId"], // value is always an array. ,"title", "description", "username", "url"
        data: function () {
            return {
                heading: "components components...",
                comments: [],
                title: "",
                description: "",
                username: "",
                file: null,
                topId: null,
                comment: "",
                name: "",
                url: ""
            };
        },
        mounted: function () {
            //console.log("component has mounted");
            //console.log("this in component :", this);
            //console.log("this.id", this.id); // working
            var that = this;
            //axios to make a req to the server to get some data:
            axios.get("/images/" + this.imageId).then(function (resp) {
                //console.log("response from get image", resp);
                //console.log("resp.data.img", resp.data.img);
                var image = resp.data.img;
                var comments = resp.data.comments;
                console.log("we are here", comments);
                that.imageId = image.id;
                that.url = image.url;
                //console.log("this.url", this.url);
                that.title = image.title;
                that.username = image.username;
                that.description = image.description;
                that.comments = comments;
                //console.log("that here", that);
            }).catch(function (err) {
                console.log("error in axios GET images/id", err);
            });
        },
        watch: {
            imageId: function () {
                //console.log("image imageId changed");
                //exactly the same that mounted does: when id changes image and comments changes
                var that = this;
                axios.get("/images/" + that.imageId).then(function (resp) {
                    // console.log("response from post image", resp);
                    //..if theres nothing with that this.id, just close the Modal
                    //if it's an err, u can handle that in your catches
                    //////////////////////////////////work here next
                    //////////////////////////////////
                    // console.log("resp.data.img", resp.data.img);


                    var image = resp.data.img;
                    var comments = resp.data.comments;
                    console.log("we are here", comments);
                    that.imageId = image.id;
                    that.url = image.url;
                    //console.log("this.url", this.url);
                    that.title = image.title;
                    that.username = image.username;
                    that.description = image.description;
                    that.comments = comments;
                    //console.log("that here", that);
                }).catch(function (err) {
                    console.log("error in axios GET images/id", err);
                });

            }
        },
        methods: {
            handleClick: function (e) {
                e.preventDefault();
                console.log("this.name", this.name);
                var that = this;
                console.log("this.comment", this.comment);
                var message = {
                    name: that.name,
                    comment: that.comment,
                    image_id: that.imageId,
                }
                //console.log("message :", message);
                axios.post("/comment", message).then(function (resp) {
                    //console.log("response ..........", resp.data.comment);
                    //console.log("comments..........", that.comments)
                    var newComment = resp.data.comment;
                    that.comments.unshift(newComment);
                }).catch(function (err) {
                    console.log("error in axios post comment", err);
                });
            },

            closeClick: function (e) {
                e.preventDefault();
                // console.log("you are trying to close me!");
                this.$emit("close-it");
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
            topId: null,
            imageId: location.hash.slice(1),
            lowestId: null,
            load: true,
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
                that.lowestId = resp.data.lowestId;
                lowestId = resp.data.lowestId;
                console.log("that.images", that.images);
                topId = that.images[that.images.length - 1].id;
                console.log(" topId", topId);
            }).catch(function (err) {
                console.log("err in axios GET script.js", err);
            });
            window.addEventListener("hashchange", function () {
                //console.log("hash changed");
                that.imageId = location.hash.slice(1);
                //console.log("imageId", imageId);

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
                var that = this;
                axios.post("/upload", formData).then(function (resp) {
                    console.log("response from formData", resp);
                    var newImg = resp.data.img;
                    console.log("newImg", newImg);
                    that.images.unshift(newImg);
                }).catch(function (err) {
                    console.log("error in axios post", err);
                });
            },
            handleChange: function (e) {
                //console.log("handle change is running");
                console.log("e.target.files[0]", e.target.files[0]);
                this.file = e.target.files[0];
            },
            // handleClickBig: function (id) {
            //     // get image id:
            //     this.id = id;
            //     this.id = id;
            // },
            closeModal: function () {
                this.imageId = null;
                location.hash = "";

            },
            removeButton: function () {
                load = false;
            },
            moreClick: function (e) {
                e.preventDefault();
                // this.images = images;
                //console.log("this.lowestId in moreClick method", this.lowestId); // working
                lowestId = this.lowestId;
                //console.log("lowestId", lowestId); //working
                var that = this;
                axios.get("/moreimages/" + topId).then(function (resp) {
                    //console.log("the response to script.js from the server", resp);
                    newImages = resp.data.images;
                    console.log("newImages", newImages);
                    topId = newImages[newImages.length - 1].id;
                    //console.log("newImages", newImages[5].id);
                    for (var i = 0; i < newImages.length; i++) {
                        if (newImages[0].lowestId == newImages[i].id) {
                            console.log("lowest id on a screen");
                            load = false;
                            ///////////////////////////////////////////////////////
                            /////////////working here//////////////////////////
                            /////////////////////////////////////////////////
                        }
                    }
                    for (var i of newImages) {
                        that.images.push(i);
                    }


                    //console.log("that.images", that.images);
                }).catch(function (err) {
                    console.log("err in axios GET moreimages script.js", err);
                    load = false;
                });
            }
        },
    });
})();