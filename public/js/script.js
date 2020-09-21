(function () {
    //no arrow func, no let, no const, no ES6, no destructuring, spreading...
    //Thus, we are going to use the promisses.  
    //how to render a component will go here:
    Vue.component("first", {
        template: "#first",
        props: ["imageId"], // value is always an array. ,"title", "description", "username", "url"
        data: function () {
            return {
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
            var that = this;
            //axios to make a req to the server to get some data:
            axios.get("/images/" + this.imageId).then(function (resp) {
                //console.log("response from get image", resp);
                //console.log("resp.data.img", resp.data.img);
                if (resp.data.length == 0) {
                    that.$emit("close");
                }
                var image = resp.data.img;
                var comments = resp.data.comments;
                console.log("we are here", comments);
                that.imageId = image.id;
                that.url = image.url;
                that.title = image.title;
                that.username = image.username;
                that.description = image.description;
                that.comments = comments;
                //that.prev = image.prev;
                //that.next = image.next;
            }).catch(function (err) {
                console.log("error in axios GET images/id", err);
                that.$emit("close");
            });
        },
        watch: {
            imageId: function () {
                //exactly the same that mounted does: when id changes image and comments changes
                var that = this;
                axios.get("/images/" + that.imageId).then(function (resp) {
                    // console.log("response from post image", resp);

                    //..if theres nothing with that this.id, just close the Modal
                    //if it's an err, u can handle that in your catches
                    //////////////////////////////////////////////////////////////
                    //////////////////////////////////work here next////////////
                    /////////////////////////////////////////////////////////////
                    // console.log("resp.data.img", resp.data);
                    // if (resp.data.error == noImg) {
                    //     that.$emit("close");
                    // }
                    if (resp.data.length == 0) {
                        that.$emit("close");
                    }
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
                    // that.prev = image.prev;
                    // that.next = image.next;
                    //console.log("that here", that);
                }).catch(function (err) {
                    //console.log("response from post image in catch", resp);
                    console.log("error in axios GET images/id", err);
                    that.$emit("close");
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
                };
                axios.post("/comment", message).then(function (resp) {
                    var newComment = resp.data.comment;
                    that.comments.unshift(newComment);
                }).then(function () {
                    that.clearCommentInput();
                }).catch(function (err) {
                    console.log("error in axios post comment", err);
                });
            },
            closeClick: function (e) {
                e.preventDefault();
                this.$emit("close");
                // an X button =  this.$emit ; showModal set to false in Vue instance
            },
            clearCommentInput: function () {
                this.comment = "";
                this.name = "";
            },
            deleteClick: function (e) {
                e.preventDefault();
                var that = this;
                axios.post("/delete/" + that.imageId).then(function (resp) {
                    console.log("response from delete", resp.data.imageId);
                    if (resp.data.success) {
                        that.imageId = resp.data.imageId;
                        that.$emit("delete", that.imageId);
                        that.$emit("close");

                    }
                }).catch(function (err) {
                    console.log("error in axios post delete in script.js", err);
                });
            }
            // prevImg: function(){

            // }
            // nextImg: function () {

            // }
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
                console.log("resp", resp.data.images); //resp has a property data that we have _up
                // console.log("this", this); // it's stops refering to vue and starts refering to a window and stops being useful in nested functions. refers to a global orject instead of vue
                //console.log("that :", that);
                that.images = resp.data.images;
                that.lowestId = resp.data.lowestId;
                lowestId = resp.data.lowestId;
                //console.log("that.images", that.images);
                topId = that.images[that.images.length - 1].id;
                //console.log(" topId", topId);
            }).catch(function (err) {
                console.log("err in axios GET script.js", err);
            });
            window.addEventListener("hashchange", function () {
                that.imageId = location.hash.slice(1);
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
                    console.log("response from formData = I need it now", resp);
                    var newImg = resp.data.image;
                    console.log("newImg", newImg);
                    that.images.unshift(newImg);
                }).then(function () {
                    that.clearInput();
                }).catch(function (err) {
                    console.log("error in axios post", err);
                });
            },
            clearInput: function () {
                this.title = "";
                this.description = "";
                this.username = "";
                this.file = null;
            },
            handleChange: function (e) {

                this.file = e.target.files[0];
            },
            closeModal: function () {
                console.log("I am about to close");
                this.imageId = null;
                location.hash = "";
            },
            removeButton: function () {
                this.load = false;
            },
            removeImg: function (id) {
                for (var i = 0; i < this.images.length; i++) {
                    if (this.images[i].id == id) {
                        this.images.splice(i, 1);
                    }
                };
            },
            moreClick: function (e) {
                e.preventDefault();
                lowestId = this.lowestId;
                //console.log("lowestId", lowestId); //working
                var that = this;
                axios.get("/moreimages/" + topId).then(function (resp) {
                    //console.log("the response to script.js from the server", resp);
                    newImages = resp.data.images;
                    //console.log("newImages", newImages);
                    topId = newImages[newImages.length - 1].id;
                    //console.log("newImages", newImages[5].id);
                    for (var i = 0; i < newImages.length; i++) {
                        if (newImages[0].lowestId == newImages[i].id) {
                            //console.log("lowest id on a screen");
                            that.load = false;
                        }
                    }
                    for (var i of newImages) {
                        that.images.push(i);
                    }
                    //console.log("that.images", that.images);
                }).catch(function (err) {
                    console.log("err in axios GET moreimages script.js", err);
                    that.load = false;
                });
            }
        },
    });
})();