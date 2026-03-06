import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register(){

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e)=>{
    e.preventDefault();

    setLoading(true);

    try{

      const response = await fetch("http://localhost:5000/api/auth/register",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await response.json();

      if(response.ok){
        alert("✅ Account created successfully");
        navigate("/");
      }else{
        alert(data.message);
      }

    }catch(error){
      alert("Server connection error");
    }

    setLoading(false);
  };

  return(
    <div className="login-bg">

      <div className="login-card">

        <h2>Create Account</h2>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        <p
          className="login-link"
          onClick={()=>navigate("/")}
        >
          Already have account? Login
        </p>

      </div>

    </div>
  );
}

export default Register;