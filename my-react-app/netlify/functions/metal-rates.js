exports.handler = async () => {
  try {
    const response = await fetch(
      "https://demos.zarpsoftware.in/goldapp/mobile/metal-rates",
    );

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch metal rates" }),
    };
  }
};
