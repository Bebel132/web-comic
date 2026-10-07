import { qtnColetaveis } from "./coletaveis.js";
import { FinalHistoria,Tropeco, Alavanca, Batida, Susto, Lanterna, Eita, Morreu, PausarAmbiente} from '../sons.js';

let posicaoLeitor = 0; //calcula a posição do leitor

let comicTerror = false; //variável booleana que define se a comic está em sua forma de terror ou não
const isMobile = window.innerWidth <= 768;

let iniciaAnimacaoPagina3 = false;
let iniciaAnimacaoPagina3Patas = false;
let iniciaAnimacaoPagina2 = false;

const posicaoEventosDeScroll = {
    pg1: 0.9, //coloca borda nos itens coletáveis
    pg2: isMobile ? 0.63 : 0.58, //mostra a animação do balao de surpresa da página 2
    pg2_bichao: isMobile ? 0.55 : 0.52, //mostra o bichão da página 2
    pg3: 0.98, //transforma a comic em terror
    pg3_patas: 0.995, //mostra as patas da página 3
    pg3Animacoes: 0.86, //inicia as animações da página 3
}

//Essas são as variáveis que definem os efeitos sonoros
let somFinalTocado = false;

function initEventosDeScroll() {
    window.addEventListener("scroll", () => {
        console.log(posicaoLeitor);

        //Calculo para saber onde o Leitor está posicionado em % no comic
        posicaoLeitor =
            (window.innerHeight + window.scrollY) /
            document.documentElement.scrollHeight;

        //Aqui os itens receberão um outline se o leitor chegar ao final da leitura sem ter coletado todos eles
        if (posicaoLeitor >= posicaoEventosDeScroll.pg1 && qtnColetaveis < 3) {
            document.querySelectorAll(".coletavel").forEach((x) => {
                x.classList.add("bordaColetavel");
            });
        }

        //As interações dentro desses parenteses só acontecerão após a comic ser destravada
        if (qtnColetaveis == 3) {
            //Parte do código responsável por localizar se a comic deve ou não ser transformada em terror
            if (!comicTerror) {
                comicTerror = posicaoLeitor >= posicaoEventosDeScroll.pg3;
            }

            //Parte que efetivamente transforma a comic em terror
            if (comicTerror) {
                document.querySelector("#balaoSurpresa").style.display = "block";
                document.querySelectorAll(".terror").forEach((x) => {
                    x.style.display = "block";
                });
                document.querySelectorAll(".padrao").forEach((x) => {
                    x.style.display = "none";
                });

                //Parte responsável pelo som da criatura
                if (!somFinalTocado) {
                    somFinalTocado = true;
                    FinalHistoria()
                }
            }

            //Esse conjunto realiza a animação de chocalho da página 3 (está com erro)
            if (
                posicaoLeitor >= posicaoEventosDeScroll.pg3Animacoes &&
                !iniciaAnimacaoPagina3
            ) {
                iniciaAnimacaoPagina3 = true;

                const tropeco = document.querySelector("#tropeco");
                const chocalha = document.querySelector("#chocalha");
                const batida = document.querySelector("#batida");
                Tropeco()
                tropeco.style.animation = "tropeco 1s ease-in-out 1";

                setTimeout(() => {
                    Alavanca()
                    chocalha.style.animation = "chocalhar .5s ease-in-out 4";
                }, 1200);

                setTimeout(() => {
                    Batida()
                    batida.style.animation = "batida .5s ease-in-out 5";
                }, 4000);
            }

            if (
                posicaoLeitor <= posicaoEventosDeScroll.pg2
                && !iniciaAnimacaoPagina2
                && comicTerror
            ) {
                iniciaAnimacaoPagina2 = true;
                Susto()
                document.querySelector("#balaoSurpresa").style.animation = "surpresa 0.5s ease-out 4";
            }

            if (
                posicaoLeitor <= posicaoEventosDeScroll.pg2_bichao
                && comicTerror
            ) {
                document.querySelectorAll(".cena").forEach(x => {
                    x.style.display = "none";
                })
                PausarAmbiente();

                const imagensJumpscare = document.querySelectorAll(".imagensJumpscare");

                imagensJumpscare[0].style.display = "block";

                imagensJumpscare.forEach((elemento, indice) => {
                    elemento.addEventListener("click", () => {
                        const proximaImagemDoJumpscare = imagensJumpscare[indice + 1];
                        if (!proximaImagemDoJumpscare) {
                            return;
                        }

                        elemento.style.display = "none";

                        if (proximaImagemDoJumpscare) {
                            if (indice + 1 === imagensJumpscare.length - 1) {
                                proximaImagemDoJumpscare.style.display = "flex";
                                proximaImagemDoJumpscare.style.filter = "none";
                                proximaImagemDoJumpscare.style.height = "100vh";
                                proximaImagemDoJumpscare.style.width = "100%";
                                document.body.style.padding = "0";
                                proximaImagemDoJumpscare.style.backgroundColor = "#ff0000";
                            } else {
                                proximaImagemDoJumpscare.style.display = "block";
                                proximaImagemDoJumpscare.style.filter = "brightness(0) invert(1)";
                                proximaImagemDoJumpscare.style.backgroundColor = "transparent";
                                Lanterna();
                            }

                            if (indice + 1 === imagensJumpscare.length - 2) {
                                Eita();
                                setTimeout(() => {
                                    Morreu();
                                }, 500);
                                setTimeout(() => {
                                    proximaImagemDoJumpscare.click();
                                }, 1000);
                            }

                            document.body.classList.add("pisca");

                            setTimeout(() => {
                                proximaImagemDoJumpscare.style.filter = "none";
                                proximaImagemDoJumpscare.style.backgroundColor = "transparent";

                                document.body.classList.remove("pisca");
                            }, 100);
                        }
                    });
                });
            }

            if (
                posicaoLeitor <= posicaoEventosDeScroll.pg3_patas
                && comicTerror
                && !iniciaAnimacaoPagina3Patas
            ) {
                iniciaAnimacaoPagina3Patas = true;
                const patas = document.querySelectorAll(".patas");
                
                if (!isMobile) {
                    let indicePata = 0;
                    if (posicaoLeitor < 0.95) {
                        indicePata = 4;
                    } else if (posicaoLeitor < 0.96) {
                        indicePata = 3;
                    } else if (posicaoLeitor < 0.97) {
                        indicePata = 2;
                    } else if (posicaoLeitor < 0.98) {
                        indicePata = 1;
                    }

                    if (!pataDesktopInicializada || !patas[indicePata].classList.contains("ativo")) {
                        patas[indicePata].classList.add("ativo");

                        if (indicePata === 0) {
                            pataDesktopInicializada = true;
                        }
                    }
                } else {
                    patas.forEach((pata, index) => {
                        setTimeout(() => {
                            pata.classList.add("ativo");
                        }, 1000 + index * 500);
                    })
                }
            }
        }
    });
}

export { initEventosDeScroll };