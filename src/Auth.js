import React from "react";
import { Button, Form, FormGroup, Label, Input, FormText, Container } from 'reactstrap';

function Auth() {
    return (
    <Container style={{display:"flex", justifyContent:'center', alignContent:'center', flexDirection:'column', height:'100vh'}}>
        <div className='form'>
            <Form action='http://localhost:9000/.netlify/functions/server/auth' method='post'>
        <FormGroup>
        <Label for="exampleEmail">Email</Label>
        <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
      </FormGroup>
      <FormGroup>
        <Label for="examplePassword">Password</Label>
        <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
        </FormGroup>
      <Button>Submit</Button>
    </Form>
        </div>

    </Container>)
}

function Login(username,password) {
    fetch('http://localhost:9000/.netlify/functions/server/auth').then(e => e.json()).then(r => console.log(r))
    return 'Hello';
}
export default Auth;


