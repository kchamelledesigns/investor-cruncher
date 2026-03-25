import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function App() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    arv: "",
    repairs: "",
    profit: 30,
    assignment: "",
    closing: 0
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateMAO = async () => {
    const arv = parseFloat(form.arv);
    const repairs = parseFloat(form.repairs);
    const profit = parseFloat(form.profit);
    const assignment = parseFloat(form.assignment);
    const closing = parseFloat(form.closing);

    const buyerProfit = arv * (profit / 100);
    const mao = arv - repairs - buyerProfit - assignment - closing;

    setResult(mao.toFixed(2));

    const payload = {
      ...form,
      mao: mao.toFixed(2)
    };

    try {
      setLoading(true);
      const res = await fetch("https://script.google.com/macros/s/AKfycby7GZI6bNcGNLoqf8e_Z1ZDLlGTBx_TFn-8Uuf8PQFQxLin34iD0Q_0zjRgX6mLoLQ/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.result === "success") {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-xl shadow-xl rounded-2xl">
        <CardContent className="p-6">

          <h1 className="text-2xl font-bold mb-2">Real Estate Calculator</h1>
          <p className="text-sm text-gray-500 mb-6">Wholesaler Deal Evaluator</p>

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Input
                placeholder="Your Name"
                name="name"
                onChange={handleChange}
                className="mb-4"
              />
              <Input
                placeholder="Your Email"
                name="email"
                type="email"
                onChange={handleChange}
                className="mb-4"
              />
              <Button onClick={() => setStep(2)} className="w-full">
                Start Calculation
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Input name="arv" placeholder="ARV" type="number" onChange={handleChange} className="mb-3" />
              <Input name="repairs" placeholder="Repair Costs" type="number" onChange={handleChange} className="mb-3" />
              <Input name="profit" placeholder="Profit %" type="number" defaultValue={30} onChange={handleChange} className="mb-3" />
              <Input name="assignment" placeholder="Assignment Fee" type="number" onChange={handleChange} className="mb-3" />
              <Input name="closing" placeholder="Closing Costs" type="number" defaultValue={0} onChange={handleChange} className="mb-4" />

              <Button onClick={calculateMAO} className="w-full">
                {loading ? "Calculating..." : "Calculate MAO"}
              </Button>

              {result && (
                <p className="mt-4 text-green-600 font-bold">
                  MAO: ${result}
                </p>
              )}

              {success && (
                <p className="mt-3 text-sm text-green-500">
                  Deal saved successfully ✅
                </p>
              )}
            </motion.div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}



