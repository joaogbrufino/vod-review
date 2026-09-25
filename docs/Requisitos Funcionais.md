# Requisitos Funcionais

**Projeto:** Plataforma Web para Revisão e Análise Tática de Partidas de VALORANT  
**Escopo consolidado:** 13 requisitos funcionais.  
**Referência das regras de negócio:** `TactiVOD_Regras_de_Negocio.md` (RN001–RN034).  

As descrições seguem o padrão adotado no DERS, com o acréscimo das referências às regras de negócio aplicáveis **na própria célula da descrição**. As dependências indicam os requisitos necessários ao funcionamento da operação descrita; não estabelecem, isoladamente, a sequência completa dos fluxos de uso. A ausência de conflitos identificados não dispensa a verificação posterior dos casos de uso.

## Requisitos Funcionais

| Código | Nome do requisito funcional | Descrição | Dependências | Conflitos |
|:---:|---|---|---|---|
| **RF001** | **Autenticar Usuário** | Permitir que usuários cadastrados acessem a plataforma mediante autenticação por credenciais.<br>**Regras de negócio aplicáveis:** RN017. | Nenhuma. | Nenhum identificado. |
| **RF002** | **Manter Usuários** | Permitir ao administrador cadastrar, consultar, alterar e desativar exclusivamente as contas dos treinadores que possuem acesso à plataforma, identificando a equipe à qual cada treinador está vinculado.<br>**Regras de negócio aplicáveis:** RN001, RN016, RN017. | RF001, RF003. | Nenhum identificado. |
| **RF003** | **Manter Equipe** | Permitir ao administrador cadastrar, consultar, alterar e excluir as informações das equipes e vincular um treinador responsável a cada equipe. O cadastro deve permanecer pendente até a criação e vinculação da conta do treinador. O treinador poderá consultar e manter somente a equipe sob sua responsabilidade, conforme suas permissões.<br>**Regras de negócio aplicáveis:** RN001, RN016, RN017, RN018. | RF001. | Nenhum identificado. |
| **RF004** | **Manter Jogadores** | Permitir cadastrar, consultar, alterar e excluir os jogadores vinculados à equipe.<br>**Regras de negócio aplicáveis:** RN002, RN003, RN017, RN018. | RF003. | Nenhum identificado. |
| **RF005** | **Consultar Desempenho dos Jogadores** | Permitir consultar o desempenho dos jogadores com base nas estatísticas informadas nos scoreboards das partidas registradas.<br>**Regras de negócio aplicáveis:** RN010, RN011, RN012, RN014, RN017, RN018, RN029, RN034. | RF004, RF006. | Nenhum identificado. |
| **RF006** | **Manter Partidas** | Permitir cadastrar, consultar, alterar e excluir partidas da equipe, incluindo seus participantes, placar final e estatísticas individuais registradas no scoreboard.<br>**Regras de negócio aplicáveis:** RN002, RN003, RN010, RN011, RN012, RN014, RN017, RN018, RN027, RN029, RN033, RN034. | RF003, RF004. | Nenhum identificado. |
| **RF007** | **Consultar Painel da Equipe** | Permitir consultar uma visão consolidada da equipe, incluindo jogadores, resultados das partidas e registros recentes das revisões, quando disponíveis.<br>**Regras de negócio aplicáveis:** RN014, RN017, RN018, RN029, RN030, RN034. | RF003, RF006; RF012 para apresentação das revisões. | Nenhum identificado. |
| **RF008** | **Manter Gravações da Partida** | Permitir enviar, consultar e remover as gravações individuais associadas à partida e a seus jogadores participantes, verificando as condições necessárias para sua utilização.<br>**Regras de negócio aplicáveis:** RN005, RN006, RN007, RN017, RN018, RN019, RN020. | RF006. | Nenhum identificado. |
| **RF009** | **Sincronizar POVs da Partida** | Permitir estabelecer e ajustar a referência temporal dos POVs de uma mesma partida por tentativa automática com OCR ou ajuste manual, quando houver múltiplas gravações.<br>**Regras de negócio aplicáveis:** RN007, RN008, RN017, RN018, RN021, RN022, RN023, RN024. | RF008. | Nenhum identificado. |
| **RF010** | **Reproduzir POVs** | Permitir reproduzir os POVs disponíveis de uma partida, utilizando controles compartilhados de reprodução e navegação temporal quando houver múltiplas gravações sincronizadas.<br>**Regras de negócio aplicáveis:** RN005, RN008, RN017, RN018, RN021, RN025. | RF008, RF009, RF012. | Nenhum identificado. |
| **RF011** | **Manter Anotações da Revisão** | Permitir registrar, consultar, alterar e excluir anotações vinculadas aos instantes da timeline durante uma sessão de revisão.<br>**Regras de negócio aplicáveis:** RN009, RN017, RN018, RN026. | RF010, RF012. | Nenhum identificado. |
| **RF012** | **Gerenciar Sessão de Revisão** | Permitir iniciar, continuar, finalizar e consultar sessões de revisão, preservando os registros produzidos e exigindo o preenchimento do scoreboard para sua finalização.<br>**Regras de negócio aplicáveis:** RN004, RN005, RN013, RN017, RN018, RN027, RN028, RN030. | RF006. | Nenhum identificado. |
| **RF013** | **Gerar Síntese da Revisão** | Permitir gerar uma síntese estruturada das anotações e das informações do scoreboard da partida, utilizando um modelo de linguagem.<br>**Regras de negócio aplicáveis:** RN015, RN017, RN018, RN031, RN032. | RF011, RF012. | Nenhum identificado. |

## Observações de rastreabilidade

- **RN017 (Controle de Acesso)** é transversal às funcionalidades restritas; por isso, aparece nos requisitos acessíveis por usuários autenticados.
- **RN018 (Restrição de Acesso do Treinador)** aparece nos requisitos que manipulam ou consultam dados de equipes sob responsabilidade do treinador.
- O perfil **Administrador** está restrito à gestão cadastral de equipes e de contas de treinadores. Os painéis, estatísticas, partidas e revisões das equipes são acessíveis somente pelos respectivos treinadores.
- **RF006** agrupa o cadastro/manutenção das partidas e o registro/correção do scoreboard; sua obrigatoriedade na finalização é verificada por **RF012**.
- **RF012** reúne o ciclo da sessão e a consulta ao histórico, sem criar requisito separado para essas consultas.
- As **34 regras de negócio** existentes (RN001–RN034) possuem ao menos uma referência nesta tabela.
