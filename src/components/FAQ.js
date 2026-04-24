import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FAQ.css";

const preguntas = [
 {
  pregunta: "¿Cómo comprar una esmeralda?",
  respuesta: "Debes seleccionar el producto y presionar el botón comprar."
 },
 {
  pregunta: "¿Cómo agregar a favoritos?",
  respuesta: "Haz clic en el botón ⭐ para guardar el producto."
 },
 {
  pregunta: "¿Los productos tienen certificado?",
  respuesta: "Sí, cada esmeralda incluye su certificado."
 },
 {
  pregunta: "¿Cómo contactar al vendedor?",
  respuesta: "Puedes usar el botón de contacto en el producto."
 },
 {
  pregunta: "¿Qué pasa si un producto está vendido?",
  respuesta: "No podrás comprarlo y aparecerá como no disponible."
 }
];

function FAQ(){

 const [abierto,setAbierto] = useState(null);
 const navigate = useNavigate();

 useEffect(()=>{

  const usuario = localStorage.getItem("usuario");

  if(!usuario){
   navigate("/login");
  }

 },[]);

 const toggle = (index)=>{
  setAbierto(abierto === index ? null : index);
 };

 return(

  <div className="faq-container">

   <h2>Preguntas Frecuentes</h2>

   {preguntas.map((item,index)=>(
    
    <div 
     key={index} 
     className="faq-item"
     onClick={()=>toggle(index)}
    >

     <div className="faq-pregunta">
      {item.pregunta}
     </div>

     {abierto === index && (
      <div className="faq-respuesta">
       {item.respuesta}
      </div>
     )}

    </div>

   ))}

  </div>

 );

}

export default FAQ;