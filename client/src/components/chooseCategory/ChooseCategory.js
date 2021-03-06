import * as React from "react";
import { Component } from "react-simplified";
import {
  Collapse,
  Col,
  Button,
  ListGroup,
  ListGroupItem,
  Glyphicon, Alert
} from "react-bootstrap";
import { CategoryService } from "../../services";
import { Category, Category2, Category3 } from "../../classTypes";
import cloneDeep from "lodash/cloneDeep";
import "./chooseCategory.css";

let categoryService = new CategoryService();

/**
 * @class ChooseCategory
 */
export class ChooseCategory extends Component<{
  registerCategory?: boolean,
  statusButton?: boolean
}> {
  constructor(props) {
    super(props);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.state = {
      showInactiveButton: false,
      category1: [],
      category2: [],
      categoryActive: "",
      selectedCategory: { name: "ingen" },
      selectedCategoryType: 0,
      selectedCategoryId: -1,
      category1Id: -1,
      category2Id: -1,
      newCategoryHeader: "Den nye overkategorien",
      show: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  //used in adminAddCategory to get the chosen category header
  //Finn ut hva som skal tas imot fra den andre
  onChangeCategoryHeader = () => {
    this.props.changeCategoryHeader(
      this.state.selectedCategoryId,
      this.state.selectedCategoryType
    );
  };

  handleDismiss() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

    /**
     * @method getSelectedCategoryId
     * @returns {number|*}
     */
  getSelectedCategoryId() {
    return this.state.selectedCategoryId;
  }

    /**
     * @method getSelectedCategoryType
     * @returns {number}
     */
  getSelectedCategoryType() {
    return this.state.selectedCategoryType;
  }

    /**
     * @method getSelectedCategoryName
     * @returns {ChooseCategory.state.selectedCategory|{name}}
     */
  getSelectedCategoryName() {
    return this.state.selectedCategory;
  }

  componentDidMount() {
    let kat1 = [];
    let kat2 = [];
    let active1 = "";

    categoryService.getCategory1().then(resources => {
      resources.map(r => {
        let elem: Category = {
          name: r.name,
          id: r.categoryId,
          priority: r.priority,
          active: r.active,
          open: false
        };
        active1 = elem.active;
        kat1 = kat1.concat(elem);
      });

      this.setState({
        category1: kat1,
        categoryActive: active1
      });
    });

    if (!this.props.registerCategory) {
      categoryService.getCategory2().then(resources => {
        resources.map(r => {
          let elem: Category2 = {
            name: r.name,
            id: r.category2Id,
            idUp: r.categoryId,
            priority: r.priority,
            active: r.active,
            open: false
          };
          kat2 = kat2.concat(elem);
        });

        this.setState({
          category2: kat2
        });
      });
    }
  }

  handleClick(cat1: Category) {
    let arr = cloneDeep(this.state.category1);

    let objectIndex = this.state.category1.indexOf(cat1);

    arr.map(e => {
      e.open = false;
    });

    arr[objectIndex].open = !this.state.category1[objectIndex].open;

    this.state.category1[objectIndex].open = !this.state.category1[objectIndex]
      .open;

    this.setState(
      {
        category1: arr,
        selectedCategory: cat1,
        selectedCategoryType: this.getCategoryType(cat1),
        selectedCategoryId: cat1.id,
        category1Id: cat1.id
      },
      this.onChangeCategoryHeader.bind(this)
    );
  }

  handleClick2(cat2: Category2) {
    const arr = cloneDeep(this.state.category2);

    let objectIndex = this.state.category2.indexOf(cat2);

    arr[objectIndex].open = !this.state.category2[objectIndex].open;

    arr.map(e => {
      e.open = false;
    });

    arr[objectIndex].open = !this.state.category2[objectIndex].open;

    this.setState(
      {
        category2: arr,
        selectedCategory: cat2,
        selectedCategoryType: this.getCategoryType(cat2),
        selectedCategoryId: cat2.id,
        showInactiveButton: true,
        category2Id: cat2.id
      },
      this.onChangeCategoryHeader.bind(this)
    );
  }

    /**
     * returns cateogory level of the selected category
     *
     * @method getCategoryType
     * @param {Object} category
     * @returns {string}
     */
  getCategoryType(category) {
    let returnValue = "0";

    this.state.category1.map(cat1 => {
      if (cat1.name == category.name) {
        returnValue = "1";
      }
    });

    this.state.category2.map(cat2 => {
      if (cat2.name == category.name) {
        returnValue = "2";
      }
    });

    return returnValue;
  }

  caret(active: boolean) {
    if (active) {
      return <span className="caret" />;
    } else {
      return <span className="caret caret-right" />;
    }
  }

  render() {
    let inactive_button;
    if (this.props.statusButton === true) {
      if (
        (this.props.statusButton === true && this.state.category2Id !== -1) ||
        this.state.category1Id !== -1
      ) {
        inactive_button = (
          <Button bsStyle="danger" onClick={this.changeToInactive}>
            Deaktiver
          </Button>
        );
      }
    } else {
      inactive_button = <p />;
    }
    let alert_delete;
    if (this.props.statusButton === true) {
      if (this.state.show) {

        alert_delete = (
          <Alert bsStyle="success" onDismiss={this.handleDismiss}>
            <h5 id="successText" >Du satt en kategori til inaktiv</h5>
          </Alert>
        );
      } else {
        alert_delete =  <p />;
      }
    }
    return (
      <div className="">
        <ListGroup>
          {this.state.category1.map(cat1 => {
            return (
              <div key={cat1.id}>
                <ListGroupItem onClick={() => this.handleClick(cat1)}>
                  {cat1.name} {this.caret(cat1.open)}
                </ListGroupItem>

                <Collapse in={cat1.open}>
                  <div>
                    {this.state.category2.map(cat2 => {
                      if (cat2.idUp == cat1.id) {
                        return (
                          <div key={cat2.id}>
                            <ListGroupItem
                              className="cat2"
                              onClick={() => this.handleClick2(cat2)}
                            >
                              {cat2.name}
                            </ListGroupItem>
                          </div>
                        );
                      }
                    })}
                  </div>
                </Collapse>
              </div>
            );
          })}
        </ListGroup>
        <Col md={3}/>
        <Col md={6}>
          {alert_delete}
        </Col>
        <Col md={3}/>
        <Col md={4} />
        <Col md={4}>
            {inactive_button}
        </Col>
        <Col md={4} />
      </div>
    );
  }

    /**
     * changes the categories chosen by admin to inactive
     *
     * @method changeToInactive
     * @returns void
     */
  changeToInactive = () => {
    if (this.state.category1Id !== -1 && this.state.category2Id === -1) {
      const category1 = this.state.category1Id;
      categoryService.updateCategory2before1(category1);
      categoryService.updateCategory1(category1);
      this.handleShow();
      location.reload()
    } else if (this.state.category2Id !== -1) {
      const category2 = this.state.category2Id;
      categoryService.updateCategory2(category2);
      this.handleShow();
      location.reload()
    }
  };

}
