# TimbraDOC

**TimbraDOC** é uma aplicação web interativa construída com React e Vite, focada na manipulação e customização de documentos PDF. O seu objetivo principal é permitir a edição, aplicação de carimbos/marcas d'água, redimensionamento e rotação de elementos de forma fluida, diretamente no navegador.

## 🚀 Funcionalidades

- **Preview em Tempo Real:** Resposta imediata na tela do usuário ao interagir com configurações visuais, utilizando transformações CSS interativas (opacidade, escala, rotação e posição).
- **Drag-and-Drop Preciso:** Posicionamento exato de elementos gráficos e documentos após ajustes de escala, garantindo que sua marcação fique perfeitamente alinhada antes da exportação final.
- **Customização Página por Página:** Ajustes granulares onde você pode configurar a escala, a posição e a rotação individualmente para cada página do PDF, ou definir uma configuração global como base para todo o documento.
- **Navegação Ágil:** Transição entre as páginas de forma intuitiva e rápida, com a possibilidade de navegar utilizando input direto.
- **Presets de Alinhamento e Configuração rápida:** Inclui presets simplificados para alinhamento rápido (esquerda, centro, direita) das inserções, focando na produtividade.
- **Exclusão de Páginas (Deleção Individual):** Ferramenta integrada na tela de Preview que permite apagar páginas em branco ou desnecessárias com um único clique, atualizando o documento temporário antes da exportação final.
- **Subdivisão Inteligente de PDFs (Fatiamento A4):** O sistema identifica proativamente documentos muito extensos (como rolos contínuos) e oferece uma divisão automática. Ele fatia o arquivo usando as proporções exatas de folhas A4 e conta com um sistema de ajuste fino de margem (overlap), garantindo que nenhuma linha de texto seja cortada pela metade nas transições.
- **Merge Assíncrono:** A mesclagem física do PDF ocorre (via `pdf-lib`) somente após clicar em "Exportar", otimizando os recursos da máquina para manter a interface local sempre fluida.

## 🛠️ Tecnologias Utilizadas

A stack principal deste projeto é altamente voltada para a edição performática no Frontend:
- **React 19** com **Vite** (Ambiente de desenvolvimento ultrarrápido).
- **[pdf-lib](https://pdf-lib.js.org/)**: Motor de criação e modificação do arquivo final.
- **[react-pdf](https://github.com/wojtekmaj/react-pdf)**: Componente para visualização limpa de arquivos PDF na interface.
- **[react-rnd](https://github.com/bokuweb/react-rnd)**: Biblioteca utilizada para a implementação central de Draggable e Resizable (Arrastar e Soltar).

## 🖥️ Como Executar Localmente

Siga o passo a passo abaixo para rodar o seu ambiente local de desenvolvimento.

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (Versão 18 ou superior recomendada).

### Passos de Instalação

1. Clone o repositório em sua máquina local.
   ```bash
   git clone https://github.com/theVyke/TimbraDOC.git
   ```
2. Entre no diretório do projeto:
   ```bash
   cd TimbraDOC
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse no navegador: Abra o link informado no console da sua máquina, geralmente em [http://localhost:5173/](http://localhost:5173/).
