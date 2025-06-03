export async function login ({username, password}) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL
    try {
        const response = await fetch (`${BASE_URL}/login`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({username, password})
        });
        if(!response.ok) {
            throw new Error ("username or password invalid")
        }

        const result = await response.json();

        return result;
    } 
    catch(err) {
        console.error(err);
    }
}