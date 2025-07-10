import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-solid border-dark-border-secondary mt-12">
      <div className="container mx-auto px-4 py-8 text-center text-dark-text-secondary">
        <p className="text-xs max-w-4xl mx-auto">
          <strong>Aviso Legal:</strong> GuardIAC es una herramienta desarrollada y gestionada en Colombia por el abogado Gabriel Guzmán, quien cuenta con más de 10 años de experiencia en el mercado legal y posee todas las facultades y el fundamento legal para el desarrollo del presente programa. La aplicación proporciona herramientas y modelos para la redacción de políticas de privacidad y la gestión del cumplimiento de la protección de datos. Si bien se hace todo lo posible para garantizar el cumplimiento de las leyes de privacidad y las mejores prácticas colombianas vigentes, la información proporcionada es solo para fines informativos y no constituye asesoramiento legal. Se sugiere a los usuarios que den el paso a consolidar una consulta detallada con el profesional aquí mencionado como especialista en la materia y cerrar las brechas de desinformación. La Inteligencia Artificial es un medio para fortalecer la labor profesional legal y no es un experto definitivo para la toma de decisiones.
        </p>
        <p className="text-sm font-medium mt-4 text-gray-500">
          © {new Date().getFullYear()} GuardIAC. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
