import { ActionArgs, json, redirect } from '@remix-run/node';
import { Form, Link } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { createUserSession, getUser } from '~/session';

export const action = async ({ request }: ActionArgs) => {

  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const errors = {
      email: email ? null : "Email is required",
      password: password ? null : "Password is required",
  };
  const hasErrors = Object.values(errors).some(
      (errorMessage) => errorMessage
    );
    if (hasErrors) {
      return json(errors);
  }

  invariant(
      typeof email === "string",
      "email must be a string"
  );
  invariant(
      typeof password === "string",
      "password must be a string"
  );
  
  const response = await fetch(`${process.env.CMS_URL}/api/users`, {
    method: "POST", 
    credentials: "include",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({email, password}),
  });
  console.log(response)
  const response2 = await fetch(`${process.env.CMS_URL}/api/users/login`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify({email, password})
  })

  const data = await response2.json();
  return createUserSession({
    redirectTo: "/pokemons",
    request,
    token: data.token!,
  });

};

const CreateAccount = () => {
  return (
    <div className="bg-purple-500 flex m-0 w-full justify-center items-center bg-blue-500 h-screen">
      <Form  className="bg-white p-4 shadow-md rounded" method="post">
      <h3>Create account</h3>
      <div className="mb-4">
        <label className='block text-gray-700 text-sm font-bold mb-2'>Email:</label>
        <input className='shadow w-4/5 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' type="text" name="email" />
      </div>
      <div className="mb-4">
      <label className='block text-gray-700 text-sm font-bold mb-2'>Password:</label>
      <input className='shadow  w-4/5 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' type="password" name="password" />
      </div>
      <div className="flex items-center justify-between">
      <button className="rounded-lg border-transparent bg-gray-800 px-4 py-2 text-white hover:bg-gray-900" type="submit">
        Create account
      </button>
      <Link className="inline-block align-baseline no-underline text-purple-500" to="/">Log in</Link>
      </div>
      </Form>
    </div>
  )
}

export default CreateAccount;