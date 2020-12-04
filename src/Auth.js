import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';
import Login from './api/lspnApi';

function Auth() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <Container style={{ display: "flex", justifyContent: 'center', alignContent: 'center', flexDirection: 'column', height: '100vh' }}>
            <div className='form'>
                <Form>
                    <FormGroup>
                        <Label for="exampleEmail">Email</Label>
                        <Input type="test" name="email" id="exampleEmail" value={username} placeholder="username" onChange={(text) => setUsername(text.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="examplePassword">Password</Label>
                        <Input type="password" name="password" id="examplePassword" value={password} placeholder="password" onChange={(text) => setPassword(text.target.value)} />
                    </FormGroup>
                    <Button onClick={() => Login(username, password)}>Submit</Button>
                </Form>
            </div>

        </Container>)
}

export default Auth;


