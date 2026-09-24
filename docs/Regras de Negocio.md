# TactiVOD — Regras de Negócio

**Projeto:** Plataforma Web para Revisão e Análise Tática de Partidas de VALORANT  
**Organização:** Regras de domínio e regras de aplicação, conforme a separação adotada no DERS com base na Arquitetura Limpa de Robert C. Martin.  
**Total:** 34 regras — 15 de domínio e 19 de aplicação.

As **regras de domínio** definem as condições e restrições próprias das entidades e do processo de revisão, independentemente das tecnologias utilizadas. As **regras de aplicação** definem como a plataforma coordena operações e casos de uso para cumprir essas condições.

## 1. Regras de Negócio de Domínio

| Nº | Tipo | Nome da regra de negócio | Descrição da regra de negócio |
|---|---|---|---|
| RN001 | Domínio | Vínculo da Equipe | Toda equipe cadastrada deve estar vinculada a um treinador responsável. |
| RN002 | Domínio | Participantes da Partida | Toda partida deve estar associada a uma equipe, e seus participantes devem corresponder a jogadores vinculados à equipe. |
| RN003 | Domínio | Limite de Participantes | Uma partida poderá possuir até cinco jogadores participantes da equipe, não sendo permitida a duplicação de um mesmo jogador entre seus participantes. |
| RN004 | Domínio | Unicidade da Sessão | Cada partida poderá possuir, no máximo, uma sessão de revisão associada. |
| RN005 | Domínio | Quantidade de Gravações | Uma sessão de revisão poderá ser iniciada com, no mínimo, uma e, no máximo, cinco gravações principais, correspondentes aos jogadores participantes da partida. |
| RN006 | Domínio | Unicidade das Gravações | Cada gravação principal deve representar o ponto de vista de um único jogador, não sendo permitida mais de uma gravação principal do mesmo jogador na partida. |
| RN007 | Domínio | Correspondência das Gravações | As gravações utilizadas em uma revisão devem corresponder à mesma partida, podendo apresentar instantes distintos de início e término. |
| RN008 | Domínio | Referência Temporal | Toda sessão de revisão deve possuir uma referência temporal que permita identificar os instantes analisados e, quando houver múltiplas gravações, estabelecer a correspondência temporal entre elas. |
| RN009 | Domínio | Vínculo das Anotações | Toda anotação deve estar vinculada a uma sessão de revisão e a um instante específico de sua referência temporal, podendo estar associada a um jogador participante ou à equipe de forma geral. |
| RN010 | Domínio | Scoreboard da Partida | Cada partida poderá possuir um único scoreboard, contendo o placar final e as estatísticas individuais dos jogadores que possuem gravações associadas à revisão. |
| RN011 | Domínio | Estatísticas Individuais | As estatísticas de abates (K), mortes (D), assistências (A) e First Blood (FK) devem representar quantidades inteiras e não negativas. Cada registro individual deve identificar o agente utilizado pelo jogador na partida. |
| RN012 | Domínio | Saldo de Abates | O saldo individual de abates deve corresponder à diferença entre a quantidade de abates e mortes do jogador (K − D). |
| RN013 | Domínio | Condição de Finalização | Uma sessão de revisão somente poderá ser considerada finalizada quando o scoreboard apresentar o placar final e as estatísticas individuais obrigatórias de todos os jogadores que possuem POVs anexados à partida. |
| RN014 | Domínio | Consolidação de Desempenho | Os indicadores de desempenho da equipe e dos jogadores devem ser calculados a partir dos resultados e das estatísticas registrados, considerando cada partida uma única vez e refletindo eventuais correções posteriores. |
| RN015 | Domínio | Vínculo da Síntese | Toda síntese gerada deve estar vinculada à respectiva sessão de revisão e representar as anotações e as informações do scoreboard utilizadas no momento de sua geração. |

## 2. Regras de Negócio de Aplicação

| Nº | Tipo | Nome da regra de negócio | Descrição da regra de negócio |
|---|---|---|---|
| RN016 | Aplicação | Gerenciamento de Usuários | A aplicação deve restringir o cadastro, a consulta, a alteração e a desativação das contas dos treinadores aos usuários com perfil de administrador. |
| RN017 | Aplicação | Controle de Acesso | A aplicação deve permitir o acesso às funcionalidades restritas somente a usuários autenticados, com contas ativas e permissões compatíveis com seu perfil. |
| RN018 | Aplicação | Restrição de Acesso do Treinador | A aplicação deve restringir as operações do treinador às equipes sob sua responsabilidade e aos respectivos jogadores, partidas e registros de revisão. |
| RN019 | Aplicação | Associação dos Participantes | Antes de associar gravações a uma partida, a aplicação deve exigir a identificação dos jogadores participantes aos quais os arquivos serão vinculados. |
| RN020 | Aplicação | Validação das Gravações | Ao receber uma gravação, a aplicação deve verificar sua compatibilidade técnica e sua associação a um participante válido, impedindo o cadastro de gravações principais duplicadas para o mesmo jogador na partida. |
| RN021 | Aplicação | Referência Temporal Individual | Quando a sessão possuir apenas uma gravação, a aplicação deve utilizá-la como referência temporal, sem exigir sincronização entre diferentes pontos de vista. |
| RN022 | Aplicação | Sincronização Automática | Quando houver duas ou mais gravações, a aplicação deve tentar identificar automaticamente a correspondência temporal por meio de reconhecimento óptico de caracteres (OCR), utilizando informações comuns disponíveis nos vídeos. |
| RN023 | Aplicação | Sincronização Manual | A aplicação deve permitir a seleção de uma gravação de referência e o ajuste manual dos deslocamentos temporais, tanto como alternativa à sincronização automática quanto para sua correção. |
| RN024 | Aplicação | Validação da Sincronização | A aplicação deve permitir que o treinador confira e valide a correspondência temporal estabelecida antes de considerar concluída a sincronização de múltiplos POVs. |
| RN025 | Aplicação | Reprodução Sincronizada | Durante a reprodução de múltiplos POVs, a aplicação deve coordenar os controles pela referência temporal estabelecida, sem interromper as demais gravações quando alguma delas não possuir conteúdo disponível em determinado instante. |
| RN026 | Aplicação | Preservação Temporal das Anotações | Ao registrar ou consultar uma anotação, a aplicação deve utilizar seu instante na referência temporal da revisão, preservando essa posição caso a sincronização das gravações seja posteriormente ajustada. |
| RN027 | Aplicação | Registro do Scoreboard | Ao solicitar a finalização de uma revisão, a aplicação deve disponibilizar ao treinador o registro do placar final e das estatísticas individuais da partida. |
| RN028 | Aplicação | Validação do Scoreboard | A aplicação deve impedir a finalização da sessão enquanto o scoreboard não apresentar o placar final e as estatísticas individuais obrigatórias de todos os jogadores que possuem gravações associadas à sessão. |
| RN029 | Aplicação | Correção do Scoreboard | A aplicação deve permitir a correção do scoreboard após a finalização da sessão e recalcular os indicadores afetados, sem exigir a criação ou reabertura de outra sessão. |
| RN030 | Aplicação | Histórico de Revisões | A aplicação deve preservar as sessões em andamento e finalizadas, permitindo ao treinador consultar os registros de revisão associados às suas partidas. |
| RN031 | Aplicação | Geração de Síntese | Após a finalização da sessão, a aplicação deve permitir a geração de uma síntese com auxílio de um modelo de linguagem, utilizando as anotações da revisão e as informações do scoreboard correspondente. |
| RN032 | Aplicação | Preservação da Síntese | A aplicação deve preservar as sínteses anteriormente geradas, mesmo quando ocorrerem alterações posteriores nas informações do scoreboard. |
| RN033 | Aplicação | Exclusão de Partidas | Ao excluir definitivamente uma partida, a aplicação deve excluir seus registros associados, incluindo o scoreboard, as gravações, a sessão de revisão, as anotações e as sínteses correspondentes. |
| RN034 | Aplicação | Atualização dos Indicadores | Após a exclusão definitiva de uma partida, a aplicação deve atualizar os indicadores consolidados da equipe e dos jogadores, desconsiderando os resultados e as estatísticas excluídos. |

## 3. Resumo

| Categoria | Quantidade | Identificadores |
|---|---:|---|
| Regras de domínio | 15 | RN001–RN015 |
| Regras de aplicação | 19 | RN016–RN034 |
| **Total** | **34** | **RN001–RN034** |

**Observação:** os nomes identificam as regras; as descrições apresentam sua formulação normativa para utilização no DERS e na especificação dos casos de uso.
