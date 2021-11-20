import React, { Component } from "react";
import ListPost from "./ListPost";

/**
 * Top list component.
 */
class TopList extends Component {
  constructor() {
    super();
    this.state = {
      searchName: "",
      searchParty: "",
    };
  }

  updateSearchName(event) {
    this.setState({ searchName: event.target.value.substring(0, 50) });
  }

  updateSearchParty(event) {
    this.setState({ searchParty: event.target.value.substring(0, 3) });
  }

  render() {
    let filteredPostsByName = this.props.listPosts.filter((listPost) => {
      return (
        listPost.namn
          .toLowerCase()
          .indexOf(this.state.searchName.toLowerCase()) !== -1
      );
    });

    let filteredPostsByParty = filteredPostsByName.filter((listPost) => {
      if (this.state.searchParty.toLowerCase() === "") {
        return listPost.parti;
      } else {
        return (
          listPost.parti.toLowerCase() === this.state.searchParty.toLowerCase()
        );
      }
    });

    let list = filteredPostsByParty.map((listPost) => {
      return <ListPost listPost={listPost} />;
    });

    return (
      <>
        <div className="topListFilterButtonName">
          <input
            className="topListFilterTextField"
            type="text"
            value={this.state.searchName}
            onChange={this.updateSearchName.bind(this)}
          />
        </div>
        <div className="topListFilterButtonParty">
          <input
            className="topListFilterTextField"
            type="text"
            value={this.state.searchParty}
            onChange={this.updateSearchParty.bind(this)}
          />
        </div>
        <dl className="topList">
          <div className="topListTitles">
            <div className="topListTitlePlacering">Placering</div>
            <div className="topListTitleNamnParti">Ledamot, parti</div>
            {this.props.resultat ? (
              <div className="topListTitleResultat">Resultat</div>
            ) : null}
          </div>
          {list}
        </dl>
      </>
    );
  }
}
export default TopList;
