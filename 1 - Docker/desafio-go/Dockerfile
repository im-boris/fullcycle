# Começamos de uma imagem super leve linux alpine e definimos um apelido para essa etapa (Multi-stage)
FROM alpine:3.14 AS desenvolvimento

# Adicionando o utilitário CURL
RUN apk add --no-cache curl

# Fazendo download do GO versão 1.21.0 
# (Escolhi uma versão um pouco mais antiga para que ajudasse a imagem final a ficar menor que 2MB conforme pedido)
RUN curl -OL https://golang.org/dl/go1.21.0.linux-amd64.tar.gz

# Extraindo GO 
RUN tar -C /usr/local -xvf go1.21.0.linux-amd64.tar.gz

# Adicionando o binário ao PATH
ENV PATH=$PATH:/usr/local/go/bin

# Definindo o diretório de trabalho padrão do container
WORKDIR /app/fullcycle/mateus-hertel/desafio-go

# Copiando o código GO para dentro do diretório de trabalho
COPY ./hello.go .

# Gerando o binário do código GO e o colocando no diretório 'bin' do sistema
RUN go build -o /bin/hello ./hello.go

# O truque para que a imagem fique abaixo de 2MB é utilizar uma 'imagem vazia'
# Onde a mesma terá apenas o necessário para executar o binário
FROM scratch

# Copiando o binário GO gerado na etapa 'desenvolvimento' para dentro do diretório 'bin'
COPY --from=desenvolvimento /bin/hello /bin/hello

# Comando padrão que será executado ao iniciar o container
CMD ["/bin/hello"]