- **Obtenção da Localização do Usuário:** O aplicativo pode solicitar permissão para acessar a localização do dispositivo do usuário.  
- **Cálculo da Distância até o Sensor:** O aplicativo calcula a distância entre a localização atual do usuário e a posição do sensor de medição.  
- **Solicitação de Dados da API:** O usuário pode solicitar as últimas leituras dos dados de temperatura e umidade diretamente da API do ThingSpeak.  
- **Exibição de Dados:** Os dados obtidos da API são organizados em cartões separados para fácil visualização.  

## Estrutura do Projeto

- **Setup Inicial:** O projeto foi iniciado com o Expo CLI e utiliza React Native para o desenvolvimento móvel. As dependências necessárias foram instaladas, como o Expo Location para acessar o GPS e o Fetch para chamadas API.  
- **Componentes Principais:**  
  - **HomeScreen:** O componente principal que abriga a lógica e a interface do usuário.  
  - **Fetch da API:** Utiliza fetch para obter dados de temperatura e umidade do sensor no ThingSpeak.  
  - **Cálculo da Distância:** Implementa a fórmula de Haversine para calcular a distância entre dois pontos com base nas coordenadas de latitude e longitude.  

## Cálculo da Distância até o Sensor

A função responsável pelo cálculo da distância é implementada da seguinte maneira:

```javascript
const haversine = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Raio da Terra em quilômetros
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Retorna a distância em quilômetros
};
```

## Como Funciona

- **Parâmetros de Entrada:** A função recebe as coordenadas do usuário (latitude e longitude) e as coordenadas do sensor.  
- **Conversão de Graus para Radianos:** Utiliza uma função auxiliar `toRad` para converter os valores de graus para radianos, já que a fórmula Haversine requer esses valores.  
- **Cálculo da Distância:** O raio da Terra é considerado para a conversão da fórmula para quilômetros. Calcula-se a distância utilizando a fórmula Haversine, que retorna a distância em quilômetros entre os dois pontos. Esta funcionalidade é crítica para o aplicativo, pois dá aos usuários uma noção clara de quão perto ou longe eles estão do sensor responsável pela medição das condições ambientais.  

## Sensoriamento Remoto

Este sistema de sensoriamento remoto faz parte de um projeto para monitoramento e medição de incêndios. O sensor é calibrado para detectar variações de temperatura e umidade que podem indicar um incêndio iminente. Em situações de emergência, as informações visíveis na tela do aplicativo são as últimas leituras lidas, permitindo ao usuário tomar decisões rápidas e informadas. A utilização desse sistema é especialmente importante em áreas propensas a incêndios, onde a vigilância constante das condições ambientais pode ajudar na prevenção e resposta a situações perigosas.  

## Conclusão

Este projeto representa um passo importante no uso da tecnologia para gerenciar e mitigar riscos relacionados a incêndios. Ele combina o monitoramento em tempo real com a mobilidade do usuário, empregando estratégias de desenvolvimento modernas para criar uma ferramenta útil e eficaz.  

Se você gostaria de contribuir com o projeto, ou se tiver dúvidas ou sugestões, sinta-se à vontade para entrar em contato.  

## Instruções para Execução

Para rodar a aplicação, utilize os seguintes comandos:

```bash
yarn install
npm start
```
```
