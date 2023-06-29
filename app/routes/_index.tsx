import { ActionArgs, json } from '@remix-run/node';
import { Form, Link, useActionData, useNavigation  } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { createUserSession } from '~/session';

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const errors = {
      email: email ? null : "email is required",
      password: password ? null : "password is required",
      errorMessages: null
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
  
  const body = { email: email, password: password}

  const response = await fetch(`${process.env.CMS_URL}/api/users/login`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(body)
  })
  
  const data = await response.json();

  if(!response.ok) {
    return json({...errors, errorMessages: data.errors});
  }

  return createUserSession({
    redirectTo: "/pokemons",
    request,
    token: data.token!,
  });
};

const LogIn = () => {
  const errors = useActionData<typeof action>();
  const navigation = useNavigation();
  const isLoggingIn = Boolean(
    navigation.state === "submitting"
  );
  
  return (
    <div className="bg-purple-300 flex m-0 w-full justify-center items-center bg-blue-500 h-screen">
      <Form className="bg-white w-full sm:w-1/2 p-4 shadow-md rounded"  method="post">
        <h3>Pokedex Log in</h3>
        <div className="mb-4">
          <label className='block text-gray-700 text-sm font-bold mb-2'>Email:</label>
          <input className='shadow w-4/5 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' type="text" name="email" />
        </div>
        <div>
        {errors?.email ? (
            <em className="text-red-600">{errors.email}</em>
        ) : null}
        </div>
        <div className="mb-4">
        <label className='block text-gray-700 text-sm font-bold mb-2'>Password:</label>
        <input className='shadow  w-4/5 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' type="password" name="password" />
        </div>
        <div className="mb-4">
          {errors?.email ? (
            <em className="text-red-600">{errors.password}</em>
          ) : null}
        </div>
        <div className="flex mb-4 items-center justify-between">
        <button className="rounded-lg border-transparent bg-gray-800 px-4 py-2 text-white hover:bg-gray-900" type="submit">
          {isLoggingIn ? "Logging in.." : "Log in"}
        </button>
        <Link className="inline-block align-baseline no-underline text-purple-500" to="/create-account">create account</Link>
        </div>
        <div className="mb-4">
          {errors?.errorMessages && errors.errorMessages.map((error : { message: string }) => (<em className="text-red-600">
            {error.message}
          </em>
          ))}
        </div>
      </Form>
    </div>
  )
}

export default LogIn;