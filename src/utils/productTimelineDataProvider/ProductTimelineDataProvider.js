const GetTimeline = (productId) => {
    let type = GetType(productId);
    return TypeData[type];
}

const GetType = (productId) => {
    switch (productId){
        case 1:
            return 1;
        default:
            return 0;
    }
}

const TypeData = [
    {
        "productId" : 1,
        "timeline" : [
            {
                "stage" : "1",
                "stageDescription": "Рассмотрение предложения от частного субъекта и заключение соглашения о реализации инвестпроекта",
                "termsDescription": "30 календарных дней",
                "segment": {
                    "id": 1,
                    "number": "4.4",
                    "text": "...",
                    "article": {
                        "id": 1,
                        "number": "37",
                        "text": "...",
                        "document": {
                            "id": 1,
                            "short_name": "ФЗ-116"
                        }
                    }
                }
            },
            {
                "stage" : "2",
                "stageDescription": "Опубликование (или направление участникам при проведении закрытого конкурса) сообщения о проведении конкурса на заключение соглашения в сети Интернет",
                "termsDescription": "не менее, чем за 30 рабочих дней до дня истечения срока предоставления заявок на участие в конкурсе",
                "segment": {
                    "id": 1,
                    "number": "1",
                    "text": "...",
                    "article": {
                        "id": 1,
                        "number": "26",
                        "text": "...",
                        "document": {
                            "id": 1,
                            "short_name": "ФЗ-116"
                        }
                    }
                }
            },
            {
                "stage" : "3",
                "stageDescription": "Предоставление конкурсной комиссией конкурсной документации",
                "termsDescription": "не позднее 10 рабочих дней до истечения срока предоставления заявок участие в конкурсе",
                "segment": {
                    "id": 1,
                    "number": "5",
                    "text": "...",
                    "article": {
                        "id": 1,
                        "number": "23",
                        "text": "...",
                        "document": {
                            "id": 1,
                            "short_name": "ФЗ-116"
                        }
                    }
                }
            },
            {
                "stage" : "4",
                "stageDescription": "Продление сроков предоставления кокурсных заявок при внесении изменений в конкурсную документацию",
                "termsDescription": "не менее, чем на 30 рабочих дней",
                "segment": {
                    "id": 1,
                    "number": "6",
                    "text": "...",
                    "article": {
                        "id": 1,
                        "number": "23",
                        "text": "...",
                        "document": {
                            "id": 1,
                            "short_name": "ФЗ-116"
                        }
                    }
                }
            },
            {
                "stage" : "5",
                "stageDescription": "Предоставление заявок (предложений) на участие в конкурсе",
                "termsDescription": "не менее, чем 30 рабочих дней со дня опубликования и размещения сообщения о проведении конкурса (или направления участникам при проведении закрытого конкурса)",
                "segment": {
                    "id": 1,
                    "number": "2",
                    "text": "...",
                    "article": {
                        "id": 1,
                        "number": "27",
                        "text": "...",
                        "document": {
                            "id": 1,
                            "short_name": "ФЗ-116"
                        }
                    }
                }
            },
            {
                "stage" : "6",
                "stageDescription": "Подписание протоколов о результатах конкурса",
                "termsDescription": "не позднее 5 рабочих дней со дня подписания конкурсной комиссией протокола рассмотрения и оценки конкурсных предложений",
                "segment": {
                    "id": 1,
                    "number": "3",
                    "text": "...",
                    "article": {
                        "id": 1,
                        "number": "34",
                        "text": "...",
                        "document": {
                            "id": 1,
                            "short_name": "ФЗ-116"
                        }
                    }
                }
            },
            {
                "stage" : "7",
                "stageDescription": "Вскрытие единственной заявки",
                "termsDescription": "в течение 3 рабочих дней со дня принятия решения о признании конкурса несостоявшимся",
                "segment": {
                    "id": 1,
                    "number": "6",
                    "text": "...",
                    "article": {
                        "id": 1,
                        "number": "29",
                        "text": "...",
                        "document": {
                            "id": 1,
                            "short_name": "ФЗ-116"
                        }
                    }
                }
            },
            {
                "stage" : "8",
                "stageDescription": "Срок рассмотрения доработанного единственным участником конкурса предложения (заявления)",
                "termsDescription": "",
                "segment": {
                    "id": 1,
                    "number": "6",
                    "text": "...",
                    "article": {
                        "id": 1,
                        "number": "29",
                        "text": "...",
                        "document": {
                            "id": 1,
                            "short_name": "ФЗ-116"
                        }
                    }
                }
            },
            {
                "stage" : "9",
                "stageDescription": "Подписание, опубликование протокола с результатами оценки конкурсных предложений (заявлений)",
                "termsDescription": "в течение 15 рабочих дней со дня подписания протокола",
                "segment": {
                    "id": 1,
                    "number": "1.2",
                    "text": "...",
                    "article": {
                        "id": 1,
                        "number": "35",
                        "text": "...",
                        "document": {
                            "id": 1,
                            "short_name": "ФЗ-116"
                        }
                    }
                }
            },
            {
                "stage" : "10",
                "stageDescription": "Предоставление разъяснений по результатам рассмотрения обращения участника конкурса",
                "termsDescription": "30 дней",
                "segment": {
                    "id": 1,
                    "number": "3",
                    "text": "...",
                    "article": {
                        "id": 1,
                        "number": "35",
                        "text": "...",
                        "document": {
                            "id": 1,
                            "short_name": "ФЗ-116"
                        }
                    }
                }
            },
            {
                "stage" : "11",
                "stageDescription": "Принятие решения о заключении соглашения (контракта) по итогам размещения информации о проведении торгов",
                "termsDescription": "45 дней со дня размещения в сети Интернет информации о проведении торгов в связи с частной инициативой",
                "segment": {
                    "id": 1,
                    "number": "4.10",
                    "text": "...",
                    "article": {
                        "id": 1,
                        "number": "37",
                        "text": "...",
                        "document": {
                            "id": 1,
                            "short_name": "ФЗ-116"
                        }
                    }
                }
            },
            {
                "stage" : "12",
                "stageDescription": "Предоставление разъяснений по результатам рассмотрения обращения участника конкурса",
                "termsDescription": "в течение 5 рабочих дней со дня подписания членами конкурсной комиссии протокола о результатах проведения конкурса",
                "segment": {
                    "id": 1,
                    "number": "1",
                    "text": "...",
                    "article": {
                        "id": 1,
                        "number": "36",
                        "text": "...",
                        "document": {
                            "id": 1,
                            "short_name": "ФЗ-116"
                        }
                    }
                }
            },
            {
                "stage" : "13",
                "stageDescription": "Аренда зем.участка после подписания соглашения",
                "termsDescription": "не позднее чем через 60 дней со дня подписания концессионного соглашения, если иные сроки не установлены конкурсной документацией",
                "segment": {
                    "id": 1,
                    "number": "1",
                    "text": "...",
                    "article": {
                        "id": 1,
                        "number": "11",
                        "text": "...",
                        "document": {
                            "id": 1,
                            "short_name": "ФЗ-116"
                        }
                    }
                }
            },
            {
                "stage" : "14",
                "stageDescription": "Уведомление частного инвестора о начале рассмотрения запроса об изменении соглашения приводящем к изменению доходов (расходов) бюджетной системы РФ",
                "termsDescription": "в течении 30 календарных дней после поступления требования от частного субъекта",
                "segment": {
                    "id": 1,
                    "number": "3.6",
                    "text": "...",
                    "article": {
                        "id": 1,
                        "number": "13",
                        "text": "...",
                        "document": {
                            "id": 1,
                            "short_name": "ФЗ-116"
                        }
                    }
                }
            },
            {
                "stage" : "15",
                "stageDescription": "Отказ частного лица от исполнения соглашения, если публичный субъект не уведомил о рассмотрении требования или не дал ответ",
                "termsDescription": "по истечении 30 календарных дней после наступления срока ответа",
                "segment": {
                    "id": 1,
                    "number": "3.7",
                    "text": "...",
                    "article": {
                        "id": 1,
                        "number": "13",
                        "text": "...",
                        "document": {
                            "id": 1,
                            "short_name": "ФЗ-116"
                        }
                    }
                }
            },
            {
                "stage" : "16",
                "stageDescription": "Изменение публичным субъектом существенных условий соглашения по требованию частного лица",
                "termsDescription": "в течение 30 календарных дней после наступления требований частного субъекта",
                "segment": {
                    "id": 1,
                    "number": "3.5",
                    "text": "...",
                    "article": {
                        "id": 1,
                        "number": "13",
                        "text": "...",
                        "document": {
                            "id": 1,
                            "short_name": "ФЗ-116"
                        }
                    }
                }
            }
        ]
    }
]


export default GetTimeline