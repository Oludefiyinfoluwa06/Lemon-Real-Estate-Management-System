const initializePayment = async (req, res) => {
  try {
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...req.body,
        redirect_url: "your-redirect-url",
        payment_options: "card,banktransfer",
      }),
    });

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  initializePayment,
};
