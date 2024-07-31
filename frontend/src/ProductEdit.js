import { Component} from "react";
import { Link, withRouter } from "react-router-dom/cjs/react-router-dom";
import { Button, Container, Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";

class ProductEdit extends Component {
    emptyItem = {
        code: '',
        name: '',
        category: '',
        brand: '',
        type: '',
        description: ''
    };   

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            isReadonly: false,
            requiredInputState: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.formatInput = this.formatInput.bind(this);
    };

    async componentDidMount() {
        if (this.props.match.params.code !== 'new') {
            const product = await (await fetch(`/products/${this.props.match.params.code}`)).json();
            this.setState({item: product, isReadonly: true});
        }
    }
    
    formatInput(event) {
        const value = event.target.value.trim();
        const name = event.target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    validateId(event) {
        const target = event.target;
        const value = target.value;
        const products = JSON.parse(sessionStorage.getItem("products"));
        const exist = products.find(p => p.code === value);
        if (exist) {
            this.setState({requiredInputState: "bad"});
        } else {
            this.setState({requiredInputState: "good"});
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item} = this.state;
        const isEdit = this.state.isReadonly;
        const requiredInputState = this.state.requiredInputState;
        if (requiredInputState === "bad") {
            return;
        }
    
        await fetch('/products' + (isEdit ? '/' + item.code : ''), {
            method: (isEdit) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/');
    }

    render() {
        const {item} = this.state;
        const isReadOnly = this.state.isReadonly;
        const title = <h2>{isReadOnly ? 'Edit Product' : 'Create Product'}</h2>;
        const requiredInputState = this.state.requiredInputState;
    
        return <div>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="code">Code<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="text" name="code" id="code" value={item.code || ''}                                                      
                            onChange={(e) => {this.handleChange(e); this.validateId(e)}} 
                            invalid={requiredInputState === "bad"} 
                            autoComplete="code" readOnly={isReadOnly} required />
                        <FormFeedback>
                            Code is already existed.
                        </FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label for="name">Name<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="text" name="name" id="name" value={item.name || ''}
                            onChange={this.handleChange} autoComplete="name" onBlur={this.formatInput}
                            required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="category">Category<span style={{ color: 'red' }}>*</span></Label>
                        <Input type="text" name="category" id="category" value={item.category || ''}
                            onChange={this.handleChange} autoComplete="category" onBlur={this.formatInput} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="brand">Brand</Label>
                        <Input type="text" name="brand" id="brand" value={item.brand || ''}
                            onChange={this.handleChange} autoComplete="brand" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="type">Type</Label>
                        <Input type="text" name="type" id="type" value={item.type || ''}
                            onChange={this.handleChange} autoComplete="type" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="textarea" name="description" id="description" value={item.description || ''}
                            onChange={this.handleChange} autoComplete="description" />
                    </FormGroup>
                    <br></br>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(ProductEdit);