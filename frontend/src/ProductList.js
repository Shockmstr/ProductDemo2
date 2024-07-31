import { Component } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Container, Table } from "reactstrap";

class ProductList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            totalPages: 1,
            pageSize: 10,
            currentPage: 1,
            dropdownOpen: false
        };
        this.remove = this.remove.bind(this);
        this.getTotalPages = this.getTotalPages.bind(this);
        this.getProductOfPage = this.getProductOfPage.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
    }

    componentDidMount() {
        fetch("/products/all")
            .then(response => response.json())
            .then(data => {
                // this.setState({products: data});
                sessionStorage.setItem("products", JSON.stringify(data));
            });
        this.getProductOfPage(this.state.currentPage, this.state.pageSize);
        this.getTotalPages(this.state.pageSize);
    }

    changePageSize(size) {
        this.setState({pageSize: size}, () => {
            this.getTotalPages(this.state.pageSize);
            this.getProductOfPage(this.state.currentPage ,this.state.pageSize);
        });    
    }

    async getProductOfPage(page, size) {
        await fetch(`/products?page=${page}&size=${size}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({ products: data });
            });
    }

    async remove(code) {
        await fetch(`/products/${code}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            }
        }).then(() => {
            let updatedProducts = [...this.state.products].filter(i => i.code !== code);
            this.setState({ products: updatedProducts });
        });
    }

    async getTotalPages(size) {
        await fetch(`/products/pages?size=${size}`)
            .then(response => response.json())
            .then((total) => {
                this.setState({ totalPages: total })
            });
    }

    render() {

        const { products, isLoading } = this.state;
        const { totalPages } = this.state;

        if (isLoading) {
            return <p>Loading...</p>
        }

        const productList = products.map((product, index) => {
            return <tr key={product.code}>
                <td>{index + 1}</td>
                <td>{product.code}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>{product.type}</td>
                <td>{product.description}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/products/" + product.code}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(product.code)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (<div>
            <Container fluid>
                <   h3>Products</h3>
                <div className="float-left">
                    <Button color="success" tag={Link} to="/products/new">Create new Product</Button>
                </div>
                <Table className="mt-4" bordered>
                    <thead>
                        <tr>
                            <th width="5%">ID</th>
                            <th width="5%">Code</th>
                            <th width="30%">Name</th>
                            <th width="10%">Category</th>
                            <th width="10%">Brand</th>
                            <th width="10%">Type</th>
                            <th width="30%">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productList}
                    </tbody>
                </Table>
                <div>
                    <label for="cars">Items per page: </label>
                    <select name="cars" id="cars" onChange={e => { 
                        this.changePageSize(parseInt(e.target.value, 10))
                    }
                    }>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                    </select>
                    <br></br><br></br>
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="next >"
                        onPageChange={e => { this.getProductOfPage(e.selected + 1, this.state.pageSize); this.setState({currentPage: e.selected+  1}) }}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        pageCount={totalPages}
                        previousLabel="< previous"
                        renderOnZeroPageCount={null}
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                    />
                </div>

            </Container>
        </div>
        );
    }
}

export default ProductList;