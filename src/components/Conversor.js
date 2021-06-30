import React, { Component } from 'react';
import './Conversor.css';
import logo from './img/Stone_pagamentos.png';

export default class Conversor extends Component {

    constructor(props) {
        super(props);

        var today = new Date(),

            date = today.getDate() + ' de ' + today.toLocaleString('default', { month: 'long' }) + ' ' + today.getFullYear(),
            hour = today.getHours() + ':' + today.getMinutes();

        this.state = {
            moedaA_valor: "",
            moedaB_valor: 0,
            completDate: date,
            completHour: hour,
            taxaEstado_valor: "",
            selectedOption: "",
            mostrarComponente: false
        }

        this.converter = this.converter.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({
            mostrarComponente: !this.state.mostrarComponent,
        });
        
    }

    componentDidMount() {
        this.cotacaoDiaria();
    }

    componentWillUnmount() {
        this.converter();
    }

    cotacaoDiaria() {
        let de_para = `${this.props.moedaA}-${this.props.moedaB}`;
        let url = `https://economia.awesomeapi.com.br/${de_para}`;

        fetch(url)
            .then(res => {
                return res.json()
            })
            .then(json => {
                let cotacao = json[0]['high'];
                let cotacaoDiaria = (parseFloat(1) * cotacao).toFixed(2);
                this.setState({ cotacaoDiaria });
            })
    }

    converter() {

        let de_para = `${this.props.moedaA}-${this.props.moedaB}`;
        let url = `https://economia.awesomeapi.com.br/${de_para}`;

        fetch(url)
            .then(res => {
                return res.json()
            })
            .then(json => {
                let cotacao = json[0]['high'];
                let cotacao_arredondada = (parseFloat(1) * cotacao).toFixed(2);
                cotacao_arredondada = parseFloat(cotacao_arredondada)

                let percent_taxaEstado = parseFloat(this.state.taxaEstado_valor) / 100;
                let percent_taxaDinheiro = 1.10 / 100;
                let percent_taxaCartao = 6.4 / 100;
                let moedaA_percent_taxaEstado = percent_taxaEstado * parseFloat(this.state.moedaA_valor)
                let cotacao_arredondada_percent_taxaDinheiro = percent_taxaDinheiro * cotacao_arredondada
                let moedaA_sum_percent_taxaEstado = moedaA_percent_taxaEstado + parseFloat(this.state.moedaA_valor)
                let cotacao_round_sum_percent_taxaDinheiro = cotacao_arredondada + cotacao_arredondada_percent_taxaDinheiro
                let multiplicacao_moedaDigitada_cotacao = moedaA_sum_percent_taxaEstado * cotacao_arredondada;

                if (this.state.selectedOption === "Dinheiro") {
                    let moedaB_valor = (moedaA_sum_percent_taxaEstado * cotacao_round_sum_percent_taxaDinheiro).toFixed(2);

                    this.setState({ moedaB_valor });
                } else if (this.state.selectedOption === "Cartão") {

                    let moedaB_valor = parseFloat(multiplicacao_moedaDigitada_cotacao + percent_taxaCartao).toFixed(2);

                    this.setState({ moedaB_valor });
                }
            })
    }

    render() {
        return (
            <div className="conversor">
                {this.state.mostrarComponent === false ? (
                <div className="firstScreen">
                    <div className="header">
                        <div className="logo">
                            <img src={logo} alt="LogoStone" />
                        </div>
                        <div className="time">
                            <div className="titles">
                                <h4>{this.state.completDate}</h4>
                                <span className="line"></span>
                                <h4>{this.state.completHour}</h4>
                            </div>
                            <div className="description">
                                <p>Dados de câmbio disponibilizados pela Morningstar.</p>
                            </div>
                        </div>
                    </div>
                    <div className="dados">
                        <div className="dolar">
                            <label >Dólar</label>
                            <input type="number" min="1" max="999" placeholder="$" onChange={(event) => (this.setState({ moedaA_valor: event.target.value }))}></input>
                        </div>
                        <div className="tx-estado">
                            <label >Taxa do Estado</label>
                            <input type="number" min="1" max="999" placeholder="%" onChange={(event) => (this.setState({ taxaEstado_valor: event.target.value }))}></input>
                        </div>
                    </div>
                    <div className="tipo-compra">
                        <h4>Tipo de Compra</h4>
                        <div className="select">
                            <div className="dinheiro">
                                <input type="radio" name="forma_pagamento" value="Dinheiro" onChange={(event) => (this.setState({ selectedOption: event.target.value }))} /><label >Dinheiro</label>
                            </div>
                            <div className="cartao">
                                <input type="radio" name="forma_pagamento" value="Cartão" onChange={(event) => (this.setState({ selectedOption: event.target.value }))} /><label >Cartão</label>
                            </div>
                        </div>
                        <button className="botao" type="button" id="btn_converter" value="Converter" onClick={() => {this.converter(); this.handleClick();}}><i className="fas fa-exchange-alt"></i>Converter</button>
                    </div>
                </div>

                ) : (
               
                <div className="secondScreen">
                    <div>
                        <button className="botao2" type="button" value="Voltar"><i className="fas fa-arrow-left"></i>Voltar</button>
                        <h2>O resultado do cálculo é:</h2>
                        <div className="card-result">
                            <h2>R${this.state.moedaB_valor}</h2>
                        </div>
                        <p> Compra no {this.state.selectedOption} e taxa de : {this.state.taxaEstado_valor}%</p>
                        <p>Cotação do Dólar: $1 = R${this.state.cotacaoDiaria}</p>
                    </div>
                </div>

                )}
            </div>

        );

    }
}