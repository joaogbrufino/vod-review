# VOD.Review — Regras de Negócio

Fonte: DERS v38 (29/10/2026). Total: 37 regras — 13 de domínio (RN001–RN013) e 24 de aplicação (RN014–RN037).

## Regras de Negócio de Domínio

| Nº | Descrição |
|---|---|
| RN001 | Toda equipe cadastrada deve estar vinculada a um único treinador responsável, e cada treinador poderá ser responsável por, no máximo, uma equipe. |
| RN002 | Toda partida deve estar associada a uma equipe, e seus participantes devem corresponder a jogadores vinculados à equipe. |
| RN003 | Uma partida poderá possuir até cinco jogadores participantes da equipe, não sendo permitida a duplicação de um mesmo jogador entre seus participantes. |
| RN004 | Cada partida poderá possuir, no máximo, uma sessão de revisão associada. |
| RN005 | Uma sessão de revisão poderá ser iniciada com, no mínimo, uma e, no máximo, cinco gravações principais, correspondentes aos jogadores participantes da partida. |
| RN006 | Cada gravação principal deve representar o ponto de vista de um único jogador, não sendo permitida mais de uma gravação principal do mesmo jogador na partida. |
| RN007 | Toda anotação deve estar vinculada a uma sessão de revisão e a um instante específico de sua referência temporal, podendo estar associada a um jogador participante ou à equipe de forma geral. |
| RN008 | Cada partida poderá possuir um único scoreboard, contendo o placar final e as estatísticas individuais de todos os jogadores participantes. |
| RN009 | As estatísticas de abates (K), mortes (D), assistências (A) e First Blood (FK) devem representar quantidades inteiras e não negativas. Cada registro individual deve identificar o agente utilizado pelo jogador na partida. |
| RN010 | O saldo individual de abates deve corresponder à diferença entre a quantidade de abates e mortes do jogador (K − D), podendo assumir valores negativos. O saldo é calculado no momento da consulta, sem armazenamento próprio. |
| RN011 | Uma sessão de revisão somente poderá ser considerada finalizada quando o scoreboard apresentar o placar final e, para cada jogador participante da partida, as estatísticas de abates (K), mortes (D), assistências (A) e primeiros abates (FK) e o agente utilizado. |
| RN012 | Os indicadores de desempenho devem ser calculados no momento da consulta, a partir dos resultados e das estatísticas das partidas com sessão de revisão finalizada, considerando cada partida uma única vez. Dessa forma, as correções do scoreboard, as alterações dos dados da partida e as exclusões de partidas são refletidas sem processamento adicional. Sem partidas consideradas, os indicadores não são apresentados. |
| RN013 | Cada sessão de revisão possui, no máximo, uma síntese, gerada uma única vez a partir das anotações e das informações do scoreboard no momento da geração. O texto gerado não pode ser editado nem gerado novamente; quando a geração falha, nenhuma síntese é registrada e a geração pode ser solicitada outra vez. |

## Regras de Negócio de Aplicação

| Nº | Descrição |
|---|---|
| RN014 | A aplicação deve restringir o cadastro, a consulta, a alteração, a ativação e a desativação das contas dos treinadores aos usuários com perfil de administrador. As contas dos treinadores não são excluídas, somente desativadas. |
| RN015 | A aplicação deve permitir o acesso às funcionalidades restritas somente a usuários autenticados, com contas ativas e permissões compatíveis com seu perfil. A desativação de uma conta deve encerrar imediatamente suas sessões autenticadas. |
| RN016 | A aplicação deve restringir as operações do treinador à equipe sob sua responsabilidade e aos respectivos jogadores, partidas e registros de revisão. |
| RN017 | Antes de associar gravações a uma partida, a aplicação deve exigir a identificação dos jogadores participantes aos quais os arquivos serão vinculados. |
| RN018 | Quando a sessão possuir apenas uma gravação, a aplicação deve utilizá-la como referência temporal, sem exigir sincronização entre diferentes pontos de vista. |
| RN019 | Quando houver duas ou mais gravações, a aplicação deve tentar identificar automaticamente a correspondência temporal por meio de reconhecimento óptico de caracteres (OCR), utilizando informações comuns disponíveis nos vídeos. |
| RN020 | A aplicação deve permitir a seleção de uma gravação de referência e o ajuste manual dos deslocamentos temporais, tanto como alternativa à sincronização automática quanto para sua correção. |
| RN021 | Com duas ou mais gravações, a correspondência temporal identificada automaticamente em todas as gravações é registrada como sincronização validada ao iniciar a revisão. Quando o início da primeira rodada não é identificado em alguma gravação, o treinador deve ajustá-la manualmente e validar a sincronização antes da reprodução sincronizada e do registro de anotações. Qualquer ajuste de deslocamento posterior exige nova validação. |
| RN022 | Durante a reprodução de múltiplos POVs, a aplicação deve coordenar os controles pela referência temporal estabelecida, sem interromper as demais gravações quando alguma delas não possuir conteúdo disponível em determinado instante, situação em que a aplicação deve indicar a ausência de conteúdo no respectivo POV. |
| RN023 | Toda sessão de revisão possui uma referência temporal, a linha do tempo da gravação de referência, na qual são registrados os instantes das anotações e o deslocamento de cada gravação indica, em milissegundos, a posição em que ela se inicia; a referência possui deslocamento zero. O ajuste dos deslocamentos não altera os instantes das anotações. A gravação de referência somente pode ser trocada refazendo-se a sincronização e enquanto a sessão não possuir anotações registradas. |
| RN024 | Ao solicitar a finalização de uma revisão, a aplicação deve disponibilizar ao treinador o registro do placar final e das estatísticas individuais da partida e impedir a finalização enquanto o scoreboard não estiver completo, conforme a RN011. |
| RN025 | A aplicação deve permitir a correção do scoreboard após a finalização da sessão, sem exigir a criação ou a reabertura de outra sessão; os indicadores passam a considerar os valores corrigidos, conforme a RN012. |
| RN026 | Após a finalização da sessão, a aplicação deve permitir a geração de uma síntese com auxílio de um modelo de linguagem, utilizando as anotações da revisão e as informações do scoreboard correspondente. |
| RN027 | Ao excluir definitivamente uma partida, a aplicação deve excluir seus registros associados, incluindo os participantes, o scoreboard, as gravações e os arquivos armazenados, a sessão de revisão, as anotações e a síntese. |
| RN028 | A aplicação deve restringir ao administrador o cadastro, a alteração e a exclusão das equipes, a atribuição dos respectivos treinadores responsáveis e a consulta de todas as equipes cadastradas, ressalvada a apresentação das equipes como opções de adversário no cadastro de partidas, conforme a RN037. |
| RN029 | Ao excluir um jogador que possua participações registradas em partidas, a aplicação deve anonimizar seus dados pessoais, substituindo o nome completo e o nickname por uma identificação genérica e removendo o Riot ID e a foto, e excluir suas gravações principais, inclusive os arquivos armazenados, preservando as participações, as estatísticas, as anotações e os indicadores da equipe. A linha do tempo das sessões de revisão não é alterada, e o ponto de vista removido passa a indicar “Gravação removida”. O jogador sem participações registradas deve ser excluído definitivamente. |
| RN030 | A exclusão de uma equipe somente poderá ser realizada quando não houver jogadores nem partidas vinculados a ela. |
| RN031 | Após a finalização da sessão de revisão, as gravações, a sincronização e as anotações podem apenas ser consultadas. Permanecem alteráveis somente o scoreboard, conforme a RN025, e os dados descritivos da partida, como adversário, evento, data, hora, tipo e mapa. |
| RN032 | O nome e a tag de cada equipe devem ser únicos na aplicação. |
| RN033 | Somente treinadores com conta ativa e sem equipe vinculada poderão ser atribuídos como responsáveis por uma equipe. |
| RN034 | O Riot ID do jogador é obrigatório e deve ser único na aplicação. |
| RN035 | Após o registro, podem ser alterados o texto da anotação e seu vínculo com a equipe ou com o jogador participante, mantendo-se o instante. As anotações são apresentadas na ordem de seus instantes. |
| RN036 | A sessão de revisão é criada quando o treinador inicia a revisão de uma partida com ao menos uma gravação enviada. Antes da criação da sessão, a remoção de um participante exclui a gravação enviada para ele; a partir da criação da sessão, os participantes e as gravações da partida não podem ser alterados. |
| RN037 | Ao cadastrar ou alterar uma partida, o adversário pode ser selecionado entre as equipes cadastradas na aplicação, das quais são apresentados somente o nome, a tag, o estado e a logo, ou informado livremente. O adversário é registrado como dado descritivo da partida, sem vínculo com a equipe adversária, que não tem acesso à partida. |
