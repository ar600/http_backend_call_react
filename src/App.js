import React, { Component } from "react";
import axios from "axios";
import "./App.css";

// instead lof logging success put null
axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    // 5.b UNEXPECTED ERROR
    console.log("Logging the error", error);
    alert("unexpected error happened");
  }

  return Promise.reject(error);
});

const apiEndpoint = "https://jsonplaceholder.typicode.com/posts";

class App extends Component {
  state = {
    posts: []
  };

  async componentDidMount() {
    const { data: posts } = await axios.get(apiEndpoint); // axios returns a promise object that has data array --> inside posts

    this.setState({ posts });
  }

  handleAdd = async () => {
    const obj = { title: "a", body: "b" };
    const { data: post } = await axios.post(apiEndpoint, obj);

    const posts = [post, ...this.state.posts];
    this.setState({ posts });
  };

  handleUpdate = async post => {
    post.title = "UPDATED";
    await axios.put(apiEndpoint + "/" + post.id, post); // updates all the properties that is why we send the whole object
    // axios.patch(apiEndpoint + "/" + post.id, { title: post.title }); // patch only updates one or more properties

    const posts = [...this.state.posts];
    const index = posts.indexOf(post);
    posts[index] = { ...post };
    this.setState({ posts });
  };

  handleDelete = async post => {
    // 1. copy the original
    const originalPosts = this.state.posts; // we create this to add to our error catching method to revert to the default posts

    // 2. await axios.delete(apiEndpoint + "/" + post.id); // move this to the bottom of the page for faster view update
    // 3. filter the posts for deletion
    const posts = this.state.posts.filter(p => p.id !== post.id);
    // 4. update the state
    this.setState({ posts });
    try {
      await axios.delete(apiEndpoint + "/" + post.id);
    } catch (error) {
      // Interceptor at the top

      // 5.a. Expected Errors (404: page not found, 400: bad request)
      if (error.response && error.response.status === 400)
        alert("This post has already been deleted!!");

      // 6. no matter we have to revert to the original
      this.setState({ posts: originalPosts });
    }
  };

  render() {
    return (
      <React.Fragment>
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
