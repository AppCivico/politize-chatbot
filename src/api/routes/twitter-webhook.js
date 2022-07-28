const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Twitter = require('twitter-lite');
const FormData = require('form-data');
const axios = require('axios');

const stasher = require('../stash');
const redis = require('../../storage/redis');
const twitter_api = require('../../webservices/twitter');
const penhas_api = require('../../webservices/penhas');
const analytics_api = require('../../webservices/analytics');

const { time } = require('console');

const flow = {
    nodes: [
        {
            "code": "node_tos",
            "type": "text_message",
            "input_type": "quick_reply",
            "messages": [
                "Olá, eu sou a Poli!, a assistente virtual da Politize!, criada em parceria com o Twitter e o Tribunal Superior Eleitoral. Estou feliz em poder tirar as suas dúvidas sobre eleições e te contar um pouco mais sobre o funcionamento da política. Afinal, ela está cada vez mais presente no nosso dia a dia, e não precisa ser chata, nem complicada, não é?",
                "Ao longo da nossa conversa, vou te oferecer algumas opções de caminhos, mas fique tranquilo(a) que não vou armazenar os seus dados pessoais, ok? Você concorda com os termos?",
                "https://docs.google.com/document/d/1es0pyuWEacWT3EVEMcLlSdMZCKoxE5Uv/edit?usp=sharing&ouid=105136001704393827539&rtpof=true&sd=true"
            ],
            "quick_replies": [
                {
                    "label": "Sim, vamos lá!",
                    "metadata": "node_tos_accepted"
                },
                {
                    "label": "Não, quem sabe outro dia!",
                    "metadata": "node_tos_refused"
                }
            ]
        },
        {
            "code": "node_tos_accepted",
            "type": "text_message",
            "input_type": "quick_reply",
            "messages": [
                "Ah, que legal! Estou muito empolgada para mostrar como a política pode ser interessante. A nossa conversa vai ficar por aqui por 24h ou até você encerrá-la, tá bom? Então, fique à vontade para sair e voltar dentro deste período. Vamos lá! Digite um dos números abaixo para começarmos!",
                "Aperte um dos números abaixo, para eu entender por onde os podermos começar hoje, por favor:",
                "1. Quero tirar todas as minhas dúvidas sobre eleições.\n\n2. Quero aprender mais sobre política no geral.\n\n3. Quero entender como identificar notícias falsas.\n\n4. Quero dicas de como conversar sobre política de forma saudável.\n\n5. Quero saber onde encontro dados sobre política.",
                "Não quer mais falar comigo? É só digitar “quero encerrar” e eu me despeço de você!"
            ],
            "quick_replies": [
                {
                    "label": "1",
                    "metadata": "node_1_1"
                },
                {
                    "label": "2",
                    "metadata": "node_1_2"
                },
                {
                    "label": "3",
                    "metadata": "node_1_3"
                },
                {
                    "label": "4",
                    "metadata": "node_1_4"
                },
                {
                    "label": "5",
                    "metadata": "node_1_5"
                },
                {
                    "label": "Quero encerrar",
                    "metadata": "node_tos_refused"
                }
            ]
        },
        {
            "code": "node_1_1",
            "type": "text_message",
            "input_type": "quick_reply",
            "messages": [
                "Ótima escolha! Estamos em 2022 e nesse ano temos Eleições Gerais. Elas acontecerão no dia 02 de outubro e essa será sua oportunidade de eleger representantes estaduais (Governador e Deputados Estaduais) e Federais (Presidente, Senadores, Deputados Federais).\n\n",
                "Vamos aprender mais sobre essas eleições? Por onde você quer começar? É só digitar o número da questão, e eu sigo com você:\n\n",
                "1. Por que é importante votar?\n\n2. O que são votos brancos e nulos?\n\n3. Quais cargos estão em disputa?\n\n4. Como escolher um(a) bom(oa) candidato(a)?\n\n5. Onde e quando eu devo ir para votar?\n\n6. Como funciona o sistema de votação?\n\n7. Como funciona uma urna eletrônica?\n\n8. Como acompanhar os resultados das eleições?\n\n9. O que as pessoas mais pergutam sobre eleições?\n\n10. O que eu posso e não posso fazer no dia da eleição?\n\n11. Onde eu posso checar as leis que regem as eleições?\n\n12. O que pode e o que não pode na propaganda eleitoral?\n\n13. Como uma campanha pode ser financiada?\n\n14. Quando uma eleição pode ser anulada?\n\n15. O que eu devo fazer depois da eleição para ser um(a) bom(a) cidadão(ã)?\n\n16, Quero voltar para o Menu Inicial",
                "Não quer mais falar comigo? É só digitar “quero encerrar” e eu me despeço de você!"
            ],
            "quick_replies": [
                {
                    "label": "1",
                    "metadata": "node_1_1_1"
                },
                {
                    "label": "2",
                    "metadata": "node_1_1_2"
                },
                {
                    "label": "3",
                    "metadata": "node_1_1_3"
                },
                {
                    "label": "4",
                    "metadata": "node_1_1_4"
                },
                {
                    "label": "5",
                    "metadata": "node_1_1_5"
                },
                {
                    "label": "6",
                    "metadata": "node_1_1_6"
                },
                {
                    "label": "7",
                    "metadata": "node_1_1_7"
                },
                {
                    "label": "8",
                    "metadata": "node_1_1_8"
                },
                {
                    "label": "9",
                    "metadata": "node_1_1_9"
                },
                {
                    "label": "10",
                    "metadata": "node_1_1_10"
                },
                {
                    "label": "11",
                    "metadata": "node_1_1_11"
                },
                {
                    "label": "12",
                    "metadata": "node_1_1_12"
                },
                {
                    "label": "13",
                    "metadata": "node_1_1_13"
                },
                {
                    "label": "14",
                    "metadata": "node_1_1_14"
                },
                {
                    "label": "15",
                    "metadata": "node_1_1_15"
                },
                {
                    "label": "16",
                    "metadata": "node_1_1_16"
                },
                {
                    "label": "Quero encerrar",
                    "metadata": "node_tos_refused"
                }
            ]
        },
        {
            "code": "node_1_2",
            "type": "text_message",
            "input_type": "quick_reply",
            "messages": [
                "Você não sabe como eu fico feliz em ler isso! É justamente para contar mais sobre a política que a Politize! foi criada e meu olho brilha toda vez que tenho a oportunidade de falar sobre isso com alguém. Tenho uma sugestão de caminho abaixo, mas fique à vontade para começar por qualquer um dos pontos.\n\n",
                "Vamos lá? Por onde você quer começar? É só digitar o número da questão, e eu sigo com você:\n\n",
                "1. O que é política?\n\n2. O que é democracia?\n\n3. Quais as principais formas de governo?\n\n4. Quais os principais sistemas de governo?\n\n5. Qual o papel dos três poderes?\n\n6. Para que serve a Constituição?\n\n7. Para que servem os partidos políticos?\n\n8. Como funciona o sistema eleitoral?\n\n9. O que fazem os governantes?\n\n10. Quais as principais correntes de pensamento?\n\n11. O que é a bússola política?\n\n12. O que é cidadania?\n\n13. Quais os direitos e deveres de um cidadão?\n\n14. Quero voltar para o menu principal\n\n",
                "Não quer mais falar comigo? É só digitar “quero encerrar” e eu me despeço de você!"
            ],
            "quick_replies": [
                {
                    "label": "1",
                    "metadata": "node_1_2_1"
                },
                {
                    "label": "2",
                    "metadata": "node_1_2_2"
                },
                {
                    "label": "3",
                    "metadata": "node_1_2_3"
                },
                {
                    "label": "4",
                    "metadata": "node_1_2_4"
                },
                {
                    "label": "5",
                    "metadata": "node_1_2_5"
                },
                {
                    "label": "6",
                    "metadata": "node_1_2_6"
                },
                {
                    "label": "7",
                    "metadata": "node_1_2_7"
                },
                {
                    "label": "8",
                    "metadata": "node_1_2_8"
                },
                {
                    "label": "9",
                    "metadata": "node_1_2_9"
                },
                {
                    "label": "10",
                    "metadata": "node_1_2_10"
                },
                {
                    "label": "11",
                    "metadata": "node_1_2_11"
                },
                {
                    "label": "12",
                    "metadata": "node_1_2_12"
                },
                {
                    "label": "13",
                    "metadata": "node_1_2_13"
                },
                {
                    "label": "14",
                    "metadata": "node_1_2_14"
                },
                {
                    "label": "Quero encerrar",
                    "metadata": "node_tos_refused"
                }
            ]
        },
        {
            "code": "node_1_3",
            "type": "text_message",
            "input_type": "quick_reply",
            "messages": [
                "Notícias falsas são um dos principais desafios na sociedade atual. Para você ter uma ideia, X% dos brasileiros já declararam ter caído em notícias falsas ao menos uma vez na vida. Dados indicam que X notícias falsas circulam por aí todos os dias. Elas influenciam nossa forma de ver o mundo e nossas decisões. Mas nenhum de nós quer ser enganado(a), não é? Fique tranquilo(a) que eu te ajudo com isso.\n\n",
                "Por onde começamos?\n\n",
                "1. O que é uma notícia falsa?\n\n2. Quais as principais características de uma notícia falsa?\n\n3. Boas práticas ao receber uma notícia\n\n4. Onde checar se uma notícia é verdadeira ou não?\n\n5. Voltar para o menu principal\n\n",
                "Não quer mais falar comigo? É só digitar “quero encerrar” e eu me despeço de você!"
            ],
            "quick_replies": [
                {
                    "label": "1",
                    "metadata": "node_1_3_1"
                },
                {
                    "label": "2",
                    "metadata": "node_1_3_2"
                },
                {
                    "label": "3",
                    "metadata": "node_1_3_3"
                },
                {
                    "label": "4",
                    "metadata": "node_1_3_4"
                },
                {
                    "label": "5",
                    "metadata": "node_1_3_5"
                },
                {
                    "label": "Quero encerrar",
                    "metadata": "node_tos_refused"
                }
            ]
        },
        {
            "code": "node_1_4",
            "type": "text_message",
            "input_type": "quick_reply",
            "messages": [
                "Nos últimos anos, tem sido difícil ter conversas em família sobre política, não é? Quem nunca viu um debate mais quente em um grupo da família? Eu mesma tenho posições políticas diferentes dos meus irmãos e dos meus amigos. Mas não é porque pensamos diferente que precisamos brigar, não é? O debate político é um dos pilares da democracia, e não podemos deixar de conversar só porque temos visões diferentes, não é?\n\n",
                "Vamos conversar um pouco mais sobre isso? Por onde começamos?\n\n",
                "1. O que é polarização política?\n\n2. Qual a diferença entre um fato e uma opinião? \n\n3. O que é e como usar comunicação não violenta?\n\n4. Dicas para falar sobre política nas redes sociais\n\n5. Projetos sobre diálogos saudáveis pelo Brasil\n\n6. Cuidado com os estereótipos\n\n7. Quero voltar para o menu principal\n\n",
                "Não quer mais falar comigo? É só digitar “quero encerrar” e eu me despeço de você!"
            ],
            "quick_replies": [
                {
                    "label": "1",
                    "metadata": "node_1_4_1"
                },
                {
                    "label": "2",
                    "metadata": "node_1_4_2"
                },
                {
                    "label": "3",
                    "metadata": "node_1_4_3"
                },
                {
                    "label": "4",
                    "metadata": "node_1_4_4"
                },
                {
                    "label": "5",
                    "metadata": "node_1_4_5"
                },
                {
                    "label": "6",
                    "metadata": "node_1_4_6"
                },
                {
                    "label": "7",
                    "metadata": "node_1_4_7"
                },
                {
                    "label": "Quero encerrar",
                    "metadata": "node_tos_refused"
                }
            ]
        },
        {
            "code": "node_1_5",
            "type": "text_message",
            "input_type": "quick_reply",
            "messages": [
                "Eu já te contei como eu amo explorar dados bem organizados? Eles sempre me ajudam a refletir sobre o mundo que estamos e o mundo que queremos. E eu adoraria poder te ajudar com isso também. Para isso, eu trago algumas dicas sobre onde encontrar dados interessantes. Vem comigo:\n\n",
                "Pode onde você quer começar?\n\n",
                "1. Onde encontrar dados sobre eleições?\n\n2. Onde encontrar dados sobre meus candidatos?\n\n3. Onde encontrar dados sobre democracia?\n\n4. Onde encontrar dados sobre polarização?\n\n5. Onde encontrar dados sobre partidos políticos?\n\n6. Onde encontrat dados sobre financiamentos de campanha?\n\n7. Onde encontrar dados sobre o perfil eleitoral dos brasileiros?\n\n8. Onde encontrar dados sobre pesquisas eleitorais?\n\n9. Onde encontrar dados sobre comparecimento eleitoral?\n\n10. Onde encontrar dados sobre a composição do governo brasileiro?\n\n11. Voltar ao Menu Inicial\n\n",
                "Não quer mais falar comigo? É só digitar “quero encerrar” e eu me despeço de você!"
            ],
            "quick_replies": [
                {
                    "label": "1",
                    "metadata": "node_1_5_1"
                },
                {
                    "label": "2",
                    "metadata": "node_1_5_2"
                },
                {
                    "label": "3",
                    "metadata": "node_1_5_3"
                },
                {
                    "label": "4",
                    "metadata": "node_1_5_4"
                },
                {
                    "label": "5",
                    "metadata": "node_1_5_5"
                },
                {
                    "label": "6",
                    "metadata": "node_1_5_6"
                },
                {
                    "label": "7",
                    "metadata": "node_1_5_7"
                },
                {
                    "label": "8",
                    "metadata": "node_1_5_8"
                },
                {
                    "label": "9",
                    "metadata": "node_1_5_9"
                },
                {
                    "label": "10",
                    "metadata": "node_1_5_10"
                },
                {
                    "label": "11",
                    "metadata": "node_1_5_11"
                },
                {
                    "label": "Quero encerrar",
                    "metadata": "node_tos_refused"
                }
            ]
        },
        {
            "code": "node_tos_refused",
            "type": "text_message",
            "input_type": "quick_reply",
            "messages": [
                "Que pena! Eu gostaria que a gente continuasse, mas fique à vontade para voltar quando quiser, tá?\n\nE não se esqueça que você sempre pode aprender mais sobre política e sobre as eleições sem gastar um centavo, e de forma simples, nos sites da Politize! e do TSE:\n\nO site da Politize! é https://www.politize.com.br e possui mais de 1800 conteúdos publicados nos mais diversos formatos. Todo dia tem conteúdo novo por lá.\n\nO site do TSE é esse aqui: https://www.tse.jus.br/ e, além de te ajudar a verificar a sua situação eleitoral, lá você encontra uma série de ferramentas, como o Fato ou Boato (https://www.justicaeleitoral.jus.br/fato-ou-boato/#), que te auxilia a identificar notícias verdadeiras e falsas. Importante em tempos de Fake News, não é?\n\nObrigada por ter vindo me conhecer. Foi um prazer! Tchau!"
            ],
            "quick_replies": [
                {
                    "label": "Voltar",
                    "metadata": "node_tos"
                }
            ]
        }
    ]
}


function get_challenge_response(crc_token, consumer_secret) {
    return crypto.createHmac('sha256', consumer_secret).update(crc_token).digest('base64');
};

async function get_tag_code(msg_code, tag_code_config, twitter_user_id) {
    let stash = await stasher.get_stash(twitter_user_id);
    stash = JSON.parse(stash);

    if (stash.tag_code) {

        return stash.tag_code
    }
    else {
        let tag_code_value = 0;

        tag_code_config.scenarios.forEach(async scenario => {

            if (scenario.check_code === msg_code) {
                tag_code_value = scenario.tag_code_value;

            }
        })


        return tag_code_value || 0;
    }
}

router.get('/twitter-webhook', (req, res) => {
    const { crc_token } = req.query;

    if (!crc_token) {
        res.status(400);
        return res.json({ error: "crc_token", error_type: "missing" });
    }

    const consumer_secret = process.env.TWITTER_CONSUMER_SECRET;

    return res.json({ response_token: 'sha256=' + get_challenge_response(crc_token, consumer_secret) });
});

router.post('/twitter-webhook', async (req, res) => {
    const encoded_flow = await redis.get('json_config');
    // const flow = JSON.parse(encoded_flow);
    // const flow = require('../flow.json');


    const direct_messages = req.body.direct_message_events;

    if (direct_messages) {
        direct_messages.forEach(async dm => {
            if (dm.message_create.source_app_id) {
                return 1;
            }

            const msg_tz = new Date(Number(dm.created_timestamp));
            const twitter_user_id = dm.message_create.sender_id;
            const remote_id = crypto.createHmac('sha256', twitter_user_id).digest('hex');

            let stash = await stasher.get_stash(twitter_user_id);
            stash = JSON.parse(stash);

            if (stash && !stash.last_conversa_finished_at) {
                stash.last_msg_epoch = Date.now();
                await stasher.save_stash(twitter_user_id, stash);

                let node = flow.nodes.filter((n) => {
                    return n.code === stash.current_node;
                });
                node = node[0];

                if (dm.message_create.message_data.quick_reply_response) {
                    const quick_reply = dm.message_create.message_data.quick_reply_response.metadata;

                    if (quick_reply.substring(0, 4) === 'node') {
                        let next_node = flow.nodes.filter((n) => {
                            return n.code === quick_reply;
                        });
                        next_node = next_node[0];
                        console.log(next_node);
                        const analytics_post = await analytics_api.post_analytics(stash.conversa_id, next_node.code, stash.current_node, stash.first_msg_tz, 1, undefined, 'DURING_DECISION_TREE');
                        const analytics_id = analytics_post.data.id;

                        stash.current_node = next_node.code;
                        stash.last_analytics_id = analytics_id;
                        await stasher.save_stash(twitter_user_id, stash);

                        if (next_node.questionnaire_id) {

                            const questionnaire_create = await penhas_api.post_questionnaire(twitter_user_id, next_node.questionnaire_id);
                            const questionnaire_data = questionnaire_create.data;

                            if (questionnaire_data.quiz_session.current_msgs[0]) {
                                const next_message = questionnaire_data.quiz_session.current_msgs[0];

                                await twitter_api.send_dm(twitter_user_id, next_message.content, next_message.options.map((opt) => {
                                    return {
                                        label: opt.display,
                                        metadata: JSON.stringify({
                                            question_ref: next_message.ref,
                                            index: opt.index,
                                            session_id: questionnaire_data.quiz_session.session_id,
                                            code_value: opt.code_value,
                                            is_questionnaire: true
                                        })
                                    }
                                }));

                                const analytics_post = await analytics_api.post_analytics(stash.conversa_id, next_message.code, stash.current_node, stash.first_msg_tz, 1, await get_tag_code(next_message.code, flow.tag_code_config, twitter_user_id), 'DURING_QUESTIONNAIRE', next_node.questionnaire_id);
                                const analytics_id = analytics_post.data.id;

                                stash.tag_code = await get_tag_code(next_message.code, flow.tag_code_config, twitter_user_id);
                                stash.last_analytics_id = analytics_id;
                                stash.current_node = next_node.code;
                                stash.is_questionnaire = true;
                                stash.current_questionnaire_question = next_message.code;
                                stash.current_questionnaire_question_type = next_message.type;
                                stash.current_questionnaire_question_ref = next_message.ref;
                                stash.current_questionnaire_options = next_message.options;
                                stash.current_questionnaire_id = next_node.questionnaire_id;
                                stash.session_id = questionnaire_data.quiz_session.session_id;

                                await stasher.save_stash(twitter_user_id, stash);
                            }
                        }
                        else {
                            stash.current_node = next_node.code;
                            stash.current_questionnaire_options = next_node.quick_replies;
                            await stasher.save_stash(twitter_user_id, stash);

                            if (next_node.messages) {
                                const text = next_node.messages.join('\n\n');
                                await twitter_api.send_dm(twitter_user_id, text, next_node.quick_replies);
                            }
                        }
                    } else {
                        const metadata = JSON.parse(quick_reply);

                        if (metadata.is_questionnaire) {
                            let timeout = 0;

                            let input_error;

                            const answer = await penhas_api.post_answer(metadata.session_id, metadata.question_ref, metadata.index);

                            const messages_len = answer.data.quiz_session.current_msgs.length;
                            let current_message_index = 0;
                            answer.data.quiz_session.current_msgs.forEach(async msg => {
                                setTimeout(
                                    async () => {
                                        current_message_index++;

                                        if (msg.type === 'yesno') {
                                            let msg_content;
                                            if (messages_len > 1) {
                                                msg_content = msg.content + ` [${current_message_index}/${messages_len}]`
                                            }
                                            else {
                                                msg_content = msg.content;
                                            }

                                            await twitter_api.send_dm(twitter_user_id, msg_content, [
                                                {
                                                    label: 'Sim',
                                                    metadata: JSON.stringify({ question_ref: msg.ref, index: 'Y', session_id: answer.data.quiz_session.session_id, is_questionnaire: true })
                                                },
                                                {
                                                    label: 'Não',
                                                    metadata: JSON.stringify({ question_ref: msg.ref, index: 'N', session_id: answer.data.quiz_session.session_id, is_questionnaire: true })
                                                }
                                            ]);
                                        } else if (msg.type === 'onlychoice') {
                                            let msg_content;
                                            if (messages_len > 1) {
                                                msg_content = msg.content + ` [${current_message_index}/${messages_len}]`
                                            }
                                            else {
                                                msg_content = msg.content;
                                            }

                                            await twitter_api.send_dm(twitter_user_id, msg_content, msg.options.map((opt) => {
                                                return {
                                                    label: opt.display,
                                                    metadata: JSON.stringify({
                                                        question_ref: msg.ref,
                                                        index: opt.index,
                                                        session_id: answer.data.quiz_session.session_id,
                                                        code_value: opt.code_value,
                                                        is_questionnaire: true
                                                    })
                                                }
                                            }));
                                        }
                                        else if (msg.type === 'displaytext') {
                                            let msg_content;
                                            if (messages_len > 1) {
                                                msg_content = msg.content + ` [${current_message_index}/${messages_len}]`
                                            }
                                            else {
                                                msg_content = msg.content;
                                            }

                                            if (msg.style === 'error') {
                                                input_error = true;
                                            }

                                            await twitter_api.send_dm(twitter_user_id, msg_content)
                                        }
                                        else if (msg.type === 'button') {
                                            let msg_content;
                                            if (messages_len > 1) {
                                                msg_content = msg.content + ` [${current_message_index}/${messages_len}]`
                                            }
                                            else {
                                                msg_content = msg.content;
                                            }

                                            const content = msg.content.length > 1 ? msg_content : 'Texto de finalização do questionário';

                                            let payload;
                                            if (msg.code.substring(0, 3) === 'FIM') {
                                                await analytics_api.post_analytics(stash.conversa_id, msg.code, stash.current_questionnaire_question, stash.first_msg_tz, 1, await get_tag_code(msg.code, flow.tag_code_config, twitter_user_id), 'QUESTIONNAIRE_FINISHED', stash.current_questionnaire_id);

                                                payload = JSON.stringify({ question_ref: msg.ref, session_id: answer.data.quiz_session.session_id, is_questionnaire_end: true })
                                                await twitter_api.send_dm(twitter_user_id, content, [
                                                    {
                                                        label: '🔃 Voltar ao início',
                                                        metadata: payload
                                                    }
                                                ]);
                                            }
                                            else if (msg.code.substring(0, 5) === 'RESET') {
                                            }
                                            else {

                                                payload = JSON.stringify({ question_ref: msg.ref, session_id: answer.data.quiz_session.session_id, is_questionnaire_reset: true })
                                                await twitter_api.send_dm(twitter_user_id, content, [
                                                    {
                                                        label: msg.label,
                                                        metadata: payload
                                                    }
                                                ]);
                                            }

                                        }
                                        else if (msg.type === 'text') {
                                            let msg_content;
                                            if (messages_len > 1) {
                                                msg_content = msg.content + ` [${current_message_index}/${messages_len}]`
                                            }
                                            else {
                                                msg_content = msg.content;
                                            }

                                            let options;
                                            if (input_error) {
                                                options = [
                                                    {
                                                        label: '🔙 Sair',
                                                        metadata: JSON.stringify({
                                                            is_questionnaire_reset: true,
                                                            gave_up: true
                                                        })
                                                    }
                                                ]
                                                input_error = false;
                                            }

                                            await twitter_api.send_dm(twitter_user_id, msg_content, options);

                                            stash.current_questionnaire_question = msg.code;
                                            stash.current_questionnaire_question_type = msg.type;
                                            stash.current_questionnaire_question_ref = msg.ref;

                                            await stasher.save_stash(twitter_user_id, stash);
                                        }

                                        if (msg.code) {

                                            if (msg.code.substring(0, 5) === 'RESET') {

                                                const node = flow.nodes[3];
                                                const new_stash = {
                                                    current_node: flow.nodes[0].code,
                                                    started_at: Date.now(),
                                                    first_msg_epoch: Number(dm.created_timestamp),
                                                    first_msg_tz: msg_tz,
                                                    current_questionnaire_options: node.quick_replies
                                                }
                                                await analytics_api.post_analytics(stash.conversa_id, msg.code, stash.current_questionnaire_question, stash.first_msg_tz, 1, await get_tag_code(msg.code, flow.tag_code_config, twitter_user_id), 'QUESTIONNAIRE_FINISHED', node.questionnaire_id);

                                                // Iniciando conversa na API de analytics
                                                const conversa = await analytics_api.post_conversa(remote_id, msg_tz);
                                                const conversa_id = conversa.data.id;
                                                new_stash.conversa_id = conversa_id;

                                                const questionnaire_create = await penhas_api.post_questionnaire(twitter_user_id, node.questionnaire_id);
                                                const questionnaire_data = questionnaire_create.data;

                                                if (questionnaire_data.quiz_session.current_msgs[0]) {
                                                    const next_message = questionnaire_data.quiz_session.current_msgs[0];

                                                    await twitter_api.send_dm(twitter_user_id, next_message.content, next_message.options.map((opt) => {
                                                        return {
                                                            label: opt.display,
                                                            metadata: JSON.stringify({
                                                                question_ref: next_message.ref,
                                                                index: opt.index,
                                                                session_id: questionnaire_data.quiz_session.session_id,
                                                                code_value: opt.code_value,
                                                                is_questionnaire: true
                                                            })
                                                        }
                                                    }));

                                                    const analytics_post = await analytics_api.post_analytics(new_stash.conversa_id, next_message.code, new_stash.current_node, new_stash.first_msg_tz, 1, await get_tag_code(next_message.code, flow.tag_code_config, twitter_user_id), 'DURING_QUESTIONNAIRE', node.questionnaire_id);
                                                    const analytics_id = analytics_post.data.id;

                                                    new_stash.tag_code = await get_tag_code(node.code, flow.tag_code_config, twitter_user_id);
                                                    new_stash.last_analytics_id = analytics_id;
                                                    new_stash.current_node = next_message.code;
                                                    new_stash.is_questionnaire = true;
                                                    new_stash.current_questionnaire_question = next_message.code;
                                                    new_stash.current_questionnaire_question_type = next_message.type;
                                                    new_stash.current_questionnaire_question_ref = next_message.ref;
                                                    new_stash.current_questionnaire_options = next_message.options;
                                                    new_stash.current_questionnaire_id = node.questionnaire_id;
                                                    new_stash.session_id = questionnaire_data.quiz_session.session_id;

                                                }


                                                await stasher.save_stash(twitter_user_id, new_stash);
                                            }
                                            else if (msg.code.substring(0, 3) === 'FIM') {
                                                stash.current_questionnaire_question = msg.code;
                                                stash.current_questionnaire_question_type = msg.type;
                                                stash.current_questionnaire_question_ref = msg.ref;
                                                stash.is_questionnaire = false;
                                                stash.last_msg_epoch = undefined;
                                                stash.current_questionnaire_options = [
                                                    {
                                                        label: '🔃 Voltar ao início',
                                                        metadata: JSON.stringify({ question_ref: msg.ref, session_id: answer.data.quiz_session.session_id, is_questionnaire_end: true })
                                                    }
                                                ];

                                                await stasher.save_stash(twitter_user_id, stash);
                                            }
                                            else {

                                                if (msg.code != stash.current_questionnaire_question) {
                                                    const analytics_post = await analytics_api.post_analytics(stash.conversa_id, msg.code, stash.current_questionnaire_question, stash.first_msg_tz, 1, (stash.tag_code || await get_tag_code(metadata.code_value, flow.tag_code_config, twitter_user_id)), 'DURING_QUESTIONNAIRE', stash.current_questionnaire_id);
                                                    analytics_id = analytics_post.data.id;

                                                    stash.tag_code = await get_tag_code(metadata.code_value, flow.tag_code_config, twitter_user_id);
                                                    stash.last_analytics_id = analytics_id;
                                                    stash.current_questionnaire_question = msg.code;
                                                    stash.current_questionnaire_question_type = msg.type;
                                                    stash.current_questionnaire_question_ref = msg.ref;
                                                    stash.current_questionnaire_options = msg.options;

                                                    await stasher.save_stash(twitter_user_id, stash);
                                                }
                                            }

                                        }
                                    },
                                    timeout
                                );

                                timeout += 2000;
                            });

                        }
                        else if (metadata.is_restart) {
                            const step_code = stash.current_questionnaire_question ? stash.current_questionnaire_question : stash.current_node;

                            await analytics_api.post_analytics(stash.conversa_id, step_code, step_code, stash.first_msg_tz, 1, undefined, 'QUESTIONNAIRE_GAVE_UP');
                            await stasher.delete_stash(twitter_user_id);
                            await twitter_api.send_dm(twitter_user_id, 'Fluxo reiniciado, na próxima mensagem você irá receber a mensagem inicial.')
                        }
                        else if (metadata.is_questionnaire_end) {

                            const node = flow.nodes[1];
                            console.log(node);
                            const new_stash = {
                                current_node: flow.nodes[0].code,
                                started_at: Date.now(),
                                first_msg_epoch: Number(dm.created_timestamp),
                                first_msg_tz: msg_tz,
                                current_questionnaire_options: node.quick_replies
                            }

                            // Iniciando conversa na API de analytics
                            const conversa = await analytics_api.post_conversa(remote_id, msg_tz);
                            const conversa_id = conversa.data.id;
                            new_stash.conversa_id = conversa_id;

                            // Fazendo post de analytics
                            const analytics_post = await analytics_api.post_analytics(conversa_id, stash.current_node, undefined, stash.first_msg_tz, 1, undefined, 'DURING_DECISION_TREE');
                            const analytics_id = analytics_post.data.id;
                            new_stash.last_analytics_id = analytics_id;

                            // Verificando por mensagens
                            const messages = node.messages;
                            const attachment = node.attachment;
                            if (messages) {
                                const text = messages.join('\n\n');
                                await twitter_api.send_dm(twitter_user_id, text, node.quick_replies, attachment);
                            }

                            await stasher.save_stash(twitter_user_id, new_stash);
                        }
                        else if (metadata.is_questionnaire_reset) {

                            let node;
                            if (metadata.gave_up) {
                                node = flow.nodes[1];
                            }
                            else {
                                node = flow.nodes[3]
                            }

                            const new_stash = {
                                current_node: node.code,
                                started_at: Date.now(),
                                first_msg_epoch: Number(dm.created_timestamp),
                                first_msg_tz: msg_tz,
                                current_questionnaire_options: node.quick_replies
                            }
                            await analytics_api.post_analytics(stash.conversa_id, stash.current_questionnaire_question, stash.current_questionnaire_question, stash.first_msg_tz, 1, await get_tag_code(node.code, flow.tag_code_config, twitter_user_id), (metadata.gave_up ? 'QUESTIONNAIRE_GAVE_UP' : 'QUESTIONNAIRE_FINISHED'), node.questionnaire_id);

                            // Iniciando conversa na API de analytics
                            const conversa = await analytics_api.post_conversa(remote_id, msg_tz);
                            const conversa_id = conversa.data.id;
                            new_stash.conversa_id = conversa_id;

                            if (node.questionnaire_id) {
                                const questionnaire_create = await penhas_api.post_questionnaire(twitter_user_id, node.questionnaire_id);
                                const questionnaire_data = questionnaire_create.data;

                                if (questionnaire_data.quiz_session.current_msgs[0]) {
                                    const next_message = questionnaire_data.quiz_session.current_msgs[0];

                                    await twitter_api.send_dm(twitter_user_id, next_message.content, next_message.options.map((opt) => {
                                        return {
                                            label: opt.display,
                                            metadata: JSON.stringify({
                                                question_ref: next_message.ref,
                                                index: opt.index,
                                                session_id: questionnaire_data.quiz_session.session_id,
                                                code_value: opt.code_value,
                                                is_questionnaire: true
                                            })
                                        }
                                    }));

                                    const analytics_post = await analytics_api.post_analytics(new_stash.conversa_id, next_message.code, new_stash.current_node, new_stash.first_msg_tz, 1, await get_tag_code(next_message.code, flow.tag_code_config, twitter_user_id), 'DURING_QUESTIONNAIRE', node.questionnaire_id);
                                    const analytics_id = analytics_post.data.id;

                                    new_stash.tag_code = await get_tag_code(node.code, flow.tag_code_config, twitter_user_id);
                                    new_stash.last_analytics_id = analytics_id;
                                    new_stash.current_node = next_message.code;
                                    new_stash.is_questionnaire = true;
                                    new_stash.current_questionnaire_question = next_message.code;
                                    new_stash.current_questionnaire_question_type = next_message.type;
                                    new_stash.current_questionnaire_question_ref = next_message.ref;
                                    new_stash.current_questionnaire_options = next_message.options;
                                    new_stash.current_questionnaire_id = node.questionnaire_id;
                                    new_stash.session_id = questionnaire_data.quiz_session.session_id;
                                }

                                await stasher.save_stash(twitter_user_id, new_stash);
                            }
                            else {
                                stash.current_node = node.code;
                                stash.current_questionnaire_options = node.quick_replies;
                                await stasher.save_stash(twitter_user_id, stash);

                                if (node.messages) {
                                    const text = node.messages.join('\n\n');
                                    await twitter_api.send_dm(twitter_user_id, text, node.quick_replies);
                                }
                            }
                        }


                    }

                }
                else {
                    const untreated_msg = dm.message_create.message_data.text;
                    const sent_msg = untreated_msg.toLowerCase();

                    if (sent_msg === 'reiniciar') {
                        if (stash.last_msg_epoch) {
                            const step_code = stash.current_questionnaire_question ? stash.current_questionnaire_question : stash.current_node;
                            await analytics_api.post_analytics(stash.conversa_id, step_code, step_code, stash.first_msg_tz, 1, undefined, 'QUESTIONNAIRE_GAVE_UP');
                            await stasher.delete_stash(twitter_user_id);
                        }

                        const node = flow.nodes[0];
                        const new_stash = {
                            current_node: flow.nodes[0].code,
                            started_at: Date.now(),
                            first_msg_epoch: Number(dm.created_timestamp),
                            first_msg_tz: msg_tz,
                            current_questionnaire_options: node.quick_replies
                        }

                        // Iniciando conversa na API de analytics
                        const conversa = await analytics_api.post_conversa(remote_id, msg_tz);
                        const conversa_id = conversa.data.id;
                        new_stash.conversa_id = conversa_id;

                        // Fazendo post de analytics
                        const analytics_post = await analytics_api.post_analytics(conversa_id, new_stash.current_node, undefined, new_stash.first_msg_tz, 1, undefined, 'DURING_DECISION_TREE');
                        const analytics_id = analytics_post.data.id;
                        new_stash.last_analytics_id = analytics_id;

                        // Verificando por mensagens
                        const messages = node.messages;
                        if (messages) {
                            const text = messages.join('\n\n');
                            await twitter_api.send_dm(twitter_user_id, text, node.quick_replies, node.attachment);
                        }

                        await stasher.save_stash(twitter_user_id, new_stash);

                    }
                    else {
                        if (stash.current_questionnaire_question_type === 'text') {
                            let timeout = 0;

                            const answer = await penhas_api.post_answer(stash.session_id, stash.current_questionnaire_question_ref, sent_msg);

                            let input_error;

                            const messages_len = answer.data.quiz_session.current_msgs.length;
                            let current_message_index = 0;
                            answer.data.quiz_session.current_msgs.forEach(async msg => {
                                setTimeout(
                                    async () => {
                                        current_message_index++;

                                        if (msg.type === 'yesno') {
                                            let msg_content;
                                            if (messages_len > 1) {
                                                msg_content = msg.content + ` [${current_message_index}/${messages_len}]`
                                            }
                                            else {
                                                msg_content = msg.content;
                                            }

                                            await twitter_api.send_dm(twitter_user_id, msg_content, [
                                                {
                                                    label: 'Sim',
                                                    metadata: JSON.stringify({ question_ref: msg.ref, index: 'Y', session_id: answer.data.quiz_session.session_id, is_questionnaire: true })
                                                },
                                                {
                                                    label: 'Não',
                                                    metadata: JSON.stringify({ question_ref: msg.ref, index: 'N', session_id: answer.data.quiz_session.session_id, is_questionnaire: true })
                                                }
                                            ]);
                                        } else if (msg.type === 'onlychoice') {
                                            let msg_content;
                                            if (messages_len > 1) {
                                                msg_content = msg.content + ` [${current_message_index}/${messages_len}]`
                                            }
                                            else {
                                                msg_content = msg.content;
                                            }

                                            await twitter_api.send_dm(twitter_user_id, msg_content, msg.options.map((opt) => {
                                                return {
                                                    label: opt.display,
                                                    metadata: JSON.stringify({
                                                        question_ref: msg.ref,
                                                        index: opt.index,
                                                        session_id: answer.data.quiz_session.session_id,
                                                        code_value: opt.code_value,
                                                        is_questionnaire: true
                                                    })
                                                }
                                            }));
                                        }
                                        else if (msg.type === 'displaytext') {
                                            let msg_content;
                                            if (messages_len > 1) {
                                                msg_content = msg.content + ` [${current_message_index}/${messages_len}]`
                                            }
                                            else {
                                                msg_content = msg.content;
                                            }

                                            if (msg.style === 'error') {
                                                input_error = true;
                                            }

                                            await twitter_api.send_dm(twitter_user_id, msg_content)
                                        }
                                        else if (msg.type === 'button') {
                                            let msg_content;
                                            if (messages_len > 1) {
                                                msg_content = msg.content + ` [${current_message_index}/${messages_len}]`
                                            }
                                            else {
                                                msg_content = msg.content;
                                            }

                                            let payload;
                                            if (msg.code.substring(0, 3) === 'FIM') {
                                                await analytics_api.post_analytics(stash.conversa_id, msg.code, stash.current_questionnaire_question, stash.first_msg_tz, 1, await get_tag_code(msg.code, flow.tag_code_config, twitter_user_id), 'QUESTIONNAIRE_FINISHED', stash.current_questionnaire_id);

                                                payload = JSON.stringify({ question_ref: msg.ref, session_id: answer.data.quiz_session.session_id, is_questionnaire_end: true })
                                                await twitter_api.send_dm(twitter_user_id, msg_content, [
                                                    {
                                                        label: '🔃 Voltar ao início',
                                                        metadata: payload
                                                    }
                                                ]);
                                            }
                                            else if (msg.code.substring(0, 5) === 'RESET') {
                                            }
                                            else {

                                                payload = JSON.stringify({ question_ref: msg.ref, session_id: answer.data.quiz_session.session_id, is_questionnaire_reset: true })
                                                await twitter_api.send_dm(twitter_user_id, msg_content, [
                                                    {
                                                        label: msg.label,
                                                        metadata: payload
                                                    }
                                                ]);
                                            }

                                        }
                                        else if (msg.type === 'text') {
                                            let msg_content;
                                            if (messages_len > 1) {
                                                msg_content = msg.content + ` [${current_message_index}/${messages_len}]`
                                            }
                                            else {
                                                msg_content = msg.content;
                                            }

                                            let options;
                                            if (input_error) {
                                                options = [
                                                    {
                                                        label: '🔙 Sair',
                                                        metadata: JSON.stringify({
                                                            is_questionnaire_reset: true,
                                                            gave_up: true
                                                        })
                                                    }
                                                ]
                                                input_error = false;
                                            }

                                            await twitter_api.send_dm(twitter_user_id, msg_content, options);

                                            stash.current_questionnaire_question = msg.code;
                                            stash.current_questionnaire_question_type = msg.type;
                                            stash.current_questionnaire_question_ref = msg.ref;

                                            await stasher.save_stash(twitter_user_id, stash);
                                        }

                                        if (msg.code) {

                                            if (msg.code.substring(0, 5) === 'RESET') {

                                                const node = flow.nodes[3];
                                                const new_stash = {
                                                    current_node: flow.nodes[0].code,
                                                    started_at: Date.now(),
                                                    first_msg_epoch: Number(dm.created_timestamp),
                                                    first_msg_tz: msg_tz,
                                                    current_questionnaire_options: node.quick_replies
                                                }
                                                await analytics_api.post_analytics(stash.conversa_id, stash.current_questionnaire_question, stash.current_questionnaire_question, stash.first_msg_tz, 1, await get_tag_code(msg.code, flow.tag_code_config, twitter_user_id), 'QUESTIONNAIRE_FINISHED', node.questionnaire_id);

                                                // Iniciando conversa na API de analytics
                                                const conversa = await analytics_api.post_conversa(remote_id, msg_tz);
                                                const conversa_id = conversa.data.id;
                                                new_stash.conversa_id = conversa_id;

                                                const questionnaire_create = await penhas_api.post_questionnaire(twitter_user_id, node.questionnaire_id);
                                                const questionnaire_data = questionnaire_create.data;

                                                if (questionnaire_data.quiz_session.current_msgs[0]) {
                                                    const next_message = questionnaire_data.quiz_session.current_msgs[0];

                                                    await twitter_api.send_dm(twitter_user_id, next_message.content, next_message.options.map((opt) => {
                                                        return {
                                                            label: opt.display,
                                                            metadata: JSON.stringify({
                                                                question_ref: next_message.ref,
                                                                index: opt.index,
                                                                session_id: questionnaire_data.quiz_session.session_id,
                                                                code_value: opt.code_value,
                                                                is_questionnaire: true
                                                            })
                                                        }
                                                    }));

                                                    const analytics_post = await analytics_api.post_analytics(new_stash.conversa_id, next_message.code, new_stash.current_node, new_stash.first_msg_tz, 1, await get_tag_code(next_message.code, flow.tag_code_config, twitter_user_id), 'DURING_QUESTIONNAIRE', node.questionnaire_id);
                                                    const analytics_id = analytics_post.data.id;

                                                    new_stash.tag_code = await get_tag_code(node.code, flow.tag_code_config, twitter_user_id);
                                                    new_stash.last_analytics_id = analytics_id;
                                                    new_stash.current_node = next_message.code;
                                                    new_stash.is_questionnaire = true;
                                                    new_stash.current_questionnaire_question = next_message.code;
                                                    new_stash.current_questionnaire_question_type = next_message.type;
                                                    new_stash.current_questionnaire_question_ref = next_message.ref;
                                                    new_stash.current_questionnaire_options = next_message.options;
                                                    new_stash.current_questionnaire_id = node.questionnaire_id;
                                                    new_stash.session_id = questionnaire_data.quiz_session.session_id;

                                                }


                                                await stasher.save_stash(twitter_user_id, new_stash);
                                            }
                                            else if (msg.code.substring(0, 3) === 'FIM') {
                                                stash.current_questionnaire_question = msg.code;
                                                stash.current_questionnaire_question_type = msg.type;
                                                stash.current_questionnaire_question_ref = msg.ref;
                                                stash.is_questionnaire = false;
                                                stash.last_msg_epoch = undefined;
                                                stash.current_questionnaire_options = [
                                                    {
                                                        label: '🔃 Voltar ao início',
                                                        metadata: JSON.stringify({ question_ref: msg.ref, session_id: answer.data.quiz_session.session_id, is_questionnaire_end: true })
                                                    }
                                                ];

                                                await stasher.save_stash(twitter_user_id, stash);
                                            }
                                            else {

                                                const analytics_post = await analytics_api.post_analytics(stash.conversa_id, msg.code, stash.current_questionnaire_question, stash.first_msg_tz, 1, (stash.tag_code || await get_tag_code(msg.code, flow.tag_code_config, twitter_user_id)), 'DURING_QUESTIONNAIRE', stash.current_questionnaire_id);
                                                analytics_id = analytics_post.data.id;

                                                stash.last_analytics_id = analytics_id;
                                                stash.current_questionnaire_question = msg.code;
                                                stash.current_questionnaire_question_type = msg.type;
                                                stash.current_questionnaire_question_ref = msg.ref;
                                                stash.current_questionnaire_options = msg.options;

                                                await stasher.save_stash(twitter_user_id, stash);
                                            }
                                        }
                                    },
                                    timeout
                                );

                                timeout += 2000;
                            });

                        }
                        else {
                            // Set counter for error messages
                            if (!stash.error_msg_count) {
                                stash.error_msg_count = 1;
                                await stasher.save_stash(twitter_user_id, stash);
                            }

                            let error_msg;
                            if (stash.error_msg_count === 1) {
                                error_msg = flow.error_msg;
                            }
                            else if (stash.error_msg_count === 2) {
                                error_msg = flow.error_msg_keyboard;
                            }
                            else if (stash.error_msg_count === 3) {
                                error_msg = flow.error_msg_video;
                            }
                            else {
                                error_msg = flow.error_msg_email;
                                stash.error_msg_count = undefined;
                            }

                            // Send error message
                            if (stash.is_questionnaire) {
                                await twitter_api.send_dm(twitter_user_id, error_msg, stash.current_questionnaire_options.map((opt) => {
                                    return { label: opt.display, metadata: JSON.stringify({ question_ref: stash.current_questionnaire_question_ref, index: opt.index, session_id: stash.session_id, is_questionnaire: true }) }
                                }))
                            }
                            else {

                                await twitter_api.send_dm(twitter_user_id, error_msg, stash.current_questionnaire_options)
                            }

                            stash.error_msg_count = stash.error_msg_count + 1;
                            await stasher.save_stash(twitter_user_id, stash);
                        }

                    }

                }
            }
            else {
                // Começando coversa
                console.log(flow);
                const node = flow.nodes[0];
                const stash = {
                    current_node: flow.nodes[0].code,
                    started_at: Date.now(),
                    first_msg_epoch: Number(dm.created_timestamp),
                    first_msg_tz: msg_tz,
                    current_questionnaire_options: node.quick_replies
                }

                // Iniciando conversa na API de analytics
                const conversa = await analytics_api.post_conversa(remote_id, msg_tz);
                const conversa_id = conversa.data.id;
                stash.conversa_id = conversa_id;

                // Fazendo post de analytics
                const analytics_post = await analytics_api.post_analytics(conversa_id, stash.current_node, undefined, stash.first_msg_tz, 1, undefined, 'DURING_DECISION_TREE');
                const analytics_id = analytics_post.data.id;
                stash.last_analytics_id = analytics_id;

                // Verificando por mensagens
                const messages = node.messages;
                if (messages) {
                    const text = messages.join('\n\n');
                    await twitter_api.send_dm(twitter_user_id, text, node.quick_replies, node.attachment);
                }

                await stasher.save_stash(twitter_user_id, stash);
            }


        });
    }

    return res.json({ message: 'ok' });
});


module.exports = router;