import React from "react";
import MathJax from "react-mathjax";

import "./table.css";

import { unit, exp, sqrt, pi as π, multiply, divide, pow } from "mathjs";

const c = unit(299792458, "m/s");
const h = unit(6.62607015e-34, "J/Hz");
const ħ = divide(h, 2 * π);
const u = unit(1.6605390666e-27, "kg");

export default class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Γbar: unit(44, "MHz"),
      ε: 0.02,
      cbar: 10,
      λ: unit(214, "nm"),
      A: 111,
      ω_Fbar: unit(74, "THz"),
      ε_s: 4e-5,
      τ_p: unit(0.5, "us"),
      d: unit(4, "um"),
    };
  }
  render() {
    const Γbar = this.state.Γbar;
    const Γ = multiply(2 * π, Γbar);
    const ε = this.state.ε;
    const cbar = this.state.cbar;
    const λ = this.state.λ;
    const I_0 = multiply(
      (4 * pow(π, 2)) / 3,
      divide(multiply(Γ, multiply(ħ, c)), pow(λ, 3))
    ).to("W/m^2");
    const A = this.state.A;
    const R = divide(h, multiply(2 * A, multiply(u, pow(λ, 2))));
    const ω_Fbar = this.state.ω_Fbar;
    const ω_F = multiply(2 * π, ω_Fbar);
    const P_0 = multiply(2 * sqrt(2) * π, divide(Γ, ω_F));
    const ε_s = this.state.ε_s;
    const τ_p = this.state.τ_p;
    const ν_str = divide(4, τ_p);
    const η = sqrt(divide(R, ν_str));
    const Ω_R = divide(π / η, τ_p);
    const I_P_0 = divide(
      multiply(6 * (3 * sqrt(2) - 4), multiply(Ω_R, multiply(I_0, ω_F))),
      pow(Γ, 2)
    );
    const I = divide(multiply(I_P_0, P_0), η * ε_s - pow(η, 2) * P_0);
    const d = this.state.d;
    const r = divide(this.state.d, 2);

    return (
      <div>
        <MathJax.Provider>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Equation</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>linewidth</td>
                <td>
                  <MathJax.Node inline formula={`Γ`} />
                </td>
                <td>
                  2π×
                  <input
                    type="number"
                    value={Γbar.toNumeric("MHz")}
                    onChange={(event) => {
                      this.setState({
                        Γbar: unit(event.target.value, "MHz"),
                      });
                    }}
                  />
                  MHz
                </td>
              </tr>

              <tr>
                <td>collection efficiency</td>
                <td>
                  <MathJax.Node inline formula={`ε`} />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.001}
                    value={ε}
                    onChange={(event) =>
                      this.setState({ ε: parseFloat(event.target.value) })
                    }
                  />
                </td>
              </tr>

              <tr>
                <td>mean counts per ion</td>
                <td>
                  <MathJax.Node inline formula={`\\bar{c}`} />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={cbar}
                    onChange={(event) =>
                      this.setState({ cbar: parseFloat(event.target.value) })
                    }
                  />
                </td>
              </tr>

              <tr>
                <td>P(0 or 1 count)</td>
                <td>
                  <MathJax.Node inline formula={`(1+\\bar{c}) e^{-\\bar{c}}`} />
                </td>
                <td>{((1 + cbar) * exp(-cbar)).toPrecision(2)}</td>
              </tr>

              <tr>
                <td>measurement time</td>
                <td>
                  <MathJax.Node inline formula={`t_m = 4 \\bar{c}/ε Γ`} />
                </td>
                <td>{divide((4 * cbar) / ε, Γ).format(2)}</td>
              </tr>

              <tr>
                <td>wavelength</td>
                <td>
                  <MathJax.Node inline formula={`λ`} />
                </td>
                <td>
                  <input
                    type="number"
                    value={λ.toNumeric("nm")}
                    onChange={(event) =>
                      this.setState({ λ: unit(event.target.value, "nm") })
                    }
                  />
                  nm
                </td>
              </tr>

              <tr>
                <td>saturation intensity</td>
                <td>
                  <MathJax.Node inline formula={`I_0 = 4\\pi^2 Γ ħ c/3 λ^3`} />
                </td>
                <td>{I_0.format(3)}</td>
              </tr>

              <tr>
                <td>mass number</td>
                <td>
                  <MathJax.Node inline formula={`A=m/u`} />
                </td>
                <td>
                  <input
                    type="number"
                    value={A}
                    onChange={(event) =>
                      this.setState({ A: event.target.value })
                    }
                  />
                </td>
              </tr>

              <tr>
                <td>recoil frequency</td>
                <td>
                  <MathJax.Node inline formula={`R = h/2Auλ^2`} />
                </td>
                <td> {R.format(2)} </td>
              </tr>

              <tr>
                <td>fine structure</td>
                <td>
                  <MathJax.Node inline formula={`ω_F`} />
                </td>
                <td>
                  2π×
                  <input
                    type="number"
                    value={ω_Fbar.toNumeric("THz")}
                    onChange={(event) => {
                      this.setState({
                        ω_Fbar: unit(event.target.value, "THz"),
                      });
                    }}
                  />
                  THz
                </td>
              </tr>

              <tr>
                <td>scattered photons at local minimum</td>
                <td>
                  <MathJax.Node
                    inline
                    formula={`P_0 \\simeq 2\\sqrt{2}πΓ/ω_F`}
                  />
                </td>
                <td>{P_0.toExponential(1)}</td>
              </tr>

              <tr>
                <td>infidelity from photon scattering</td>
                <td>
                  <MathJax.Node inline formula={`ε_s`} />
                </td>
                <td>
                  <input
                    type="number"
                    value={ε_s}
                    onChange={(event) =>
                      this.setState({ ε_s: event.target.value })
                    }
                  />
                </td>
              </tr>

              <tr>
                <td>phase-gate time</td>
                <td>
                  <MathJax.Node inline formula={`τ_p`} />
                </td>
                <td>
                  <input
                    type="number"
                    value={τ_p.toNumeric("us")}
                    onChange={(event) =>
                      this.setState({ τ_p: unit(event.target.value, "us") })
                    }
                  />
                  µs
                </td>
              </tr>

              <tr>
                <td>stretch mode frequency</td>
                <td>
                  <MathJax.Node inline formula={`ν_\\text{str} \\simeq	4/τ_p`} />
                </td>
                <td>{ν_str.format(2)}</td>
              </tr>

              <tr>
                <td>stretch mode frequency</td>
                <td>
                  <MathJax.Node
                    inline
                    formula={`ν_\\text{com} = ν_\\text{str}/\\sqrt{3}`}
                  />
                </td>
                <td>{divide(ν_str, sqrt(3)).format(2)}</td>
              </tr>

              <tr>
                <td>stretch-mode Lamb Dicke parameter</td>
                <td>
                  <MathJax.Node
                    inline
                    formula={`η = \\sqrt{R/ν_\\text{str}}`}
                  />
                </td>
                <td>{η.toPrecision(1)}</td>
              </tr>

              <tr>
                <td>carrier Raman Rabi frequency</td>
                <td>
                  <MathJax.Node inline formula={`Ω_\\text{R} = π/ητ_p`} />
                </td>
                <td>2π×{divide(Ω_R, 2 * π).format(2)}</td>
              </tr>

              <tr>
                <td>
                  laser intensity for <MathJax.Node inline formula={`P_0`} />
                </td>
                <td>
                  <MathJax.Node
                    inline
                    formula={`6ω_F(3\\sqrt{2}-4)Ω_RI_0/Γ^2`}
                  />
                </td>
                <td>{I_P_0.to("mW/um^2").format(2)}</td>
              </tr>

              <tr>
                <td>laser intensity per beam</td>
                <td>
                  <MathJax.Node
                    inline
                    formula={`I = I_{P_0} P_0 / (η ε_s - η^2 P_0)`}
                  />
                </td>
                <td>{I.to("mW/um^2").format(2)}</td>
              </tr>

              <tr>
                <td>beam diameter</td>
                <td>
                  <MathJax.Node inline formula={`2r`} />
                </td>
                <td>
                  <input
                    type="number"
                    value={d.toNumeric("um")}
                    onChange={(event) =>
                      this.setState({ d: unit(event.target.value, "um") })
                    }
                  />
                  µm
                </td>
              </tr>

              <tr>
                <td>power per beam</td>
                <td>
                  <MathJax.Node inline formula={`π r^2 I`} />
                </td>
                <td>
                  {multiply(π, multiply(pow(r, 2), I))
                    .to("mW")
                    .format(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </MathJax.Provider>
      </div>
    );
  }
}
