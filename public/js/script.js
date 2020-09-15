(function () {
    //no arrow func, no let, no const, no ES6, no destructuring, spreading...
    //Thus, we are going to use the promisses.
    // a constructor called vue:
    new Vue({
        el: "main",
        data: {
            images: [],
            //values of input field:
            title: "",
            description: "",
            username: "",
            file: null,
            //subHeading: "This is a subheading",// I will render it on the screen
            //cuteAnimals: ["giraffe", "capybara", "quoka", "penguin"],
        },
        mounted: function () {
            //lifecycle method
            //mounted is a function that runs after HTML has been rendered (only runs once)
            //when I want to render data from database the moment the page loads = answer is mounted"
            //console.log("mounted is running");
            // $.ajax() - we have to find a way to do this without jquery. answer - use axios (we already have a link in our html)

            //console.log("this", this); //this refers to vue, but it will absolutelly different than the one in a nested scope = look_down
            // this.heading = "giraffes are ok-ish"//rewriting the heading; manipulate data
            //that is why we create a variable "that" for "this" outside of nested scope: "that" variable will not change it's value like "this" do
            var that = this;
            axios.get("/images").then(function (resp) {
                // resp = response from the server
                //console.log("resp", resp.data.cuteAnimals); //resp has a property data that we have _up
                // console.log("this", this); // it's stops refering to vue and starts refering to a window and stops being useful in nested functions. refers to a global orject instead of vue
                //console.log("that :", that);
                that.images = resp.data.images;
                //we get info from the server
            }).catch(function (err) {
                console.log("err in axios GET script.js", err);
            });
        },
        methods: {
            handleClick: function (e) {
                e.preventDefault();
                console.log("this : ", this);
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
                console.log("handle change is running");
                console.log("e.target.files[0]", e.target.files[0]);
                this.file = e.target.files[0];
            }
        },
    });

})();