FROM debian
RUN apt update && apt install python3 gcc nodejs npm -y
RUN mkdir /sandbox && chmod 777 /sandbox
ADD ./data /sandbox
RUN cd /sandbox && npm init -y && npm i express cors
EXPOSE 8080
EXPOSE 3000
RUN printf "#!/bin/bash\npython3 /sandbox/server.py & npm start --prefix /sandbox\n" > /sandbox/runner && chmod +x /sandbox/runner
CMD ["bash","/sandbox/runner"]
