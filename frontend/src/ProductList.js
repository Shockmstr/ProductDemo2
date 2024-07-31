import { Component } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Container, Pagination, PaginationItem, PaginationLink, Table } from "reactstrap";

class ProductList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            totalPages: 1
        };
        this.remove = this.remove.bind(this);
        this.category = this.getTotalPages.bind(this);
    }

    componentDidMount() {
        fetch("/products/all")
            .then(response => response.json())
            .then(data => {
                this.setState({products: data});
                sessionStorage.setItem("products", JSON.stringify(this.state.products));
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
            this.setState({products: updatedProducts});
        });
    }

    async getTotalPages(size) {
        await fetch(`/products/pages?size=${size}`)
        .then((total) => {
            this.setState({totalPages: total})
        });
    }    

    render() {
        this.getTotalPages(5);
        const {products, isLoading} = this.state;
        const {totalPages} = this.state;

        if (isLoading) {
            return <p>Loading...</p>
        }
        
        const productList = products.map(product => {
            return <tr key={product.code}>
                <td>{product.code}</td>
                <td style={{whiteSpace: 'nowrap'}}>{product.name}</td>
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

        let paginationSize;       
        for (let index = 0; index < totalPages; index++) {
            paginationSize += <PaginationItem>
                <PaginationLink href="">
                    index;
                </PaginationLink>
            </PaginationItem>
        }
        

        return (<div>
            <Container fluid>
            <   h3>Products</h3>
                <div className="float-left">
                    <Button color="success" tag={Link} to="/products/new">Create new Product</Button>
                </div>                
                <Table className="mt-4" bordered>
                    <thead>
                    <tr>
                        <th width="10%">Code</th>
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
            <Pagination>
                <PaginationItem>
                    <PaginationLink previous href="" />
                </PaginationItem>
                {paginationSize}
                <PaginationItem>
                    <PaginationLink next href="" />
                </PaginationItem>
            </Pagination>
            </Container>
        </div>
        );
    }
}

export default ProductList;