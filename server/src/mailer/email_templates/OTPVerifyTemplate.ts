export function otpVerificationTemplate(otp: string): string {

        let temp = `
                <div style="max-width: 700px;text-align: center; text-transform: uppercase;
                margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
                <h2 style="color: teal;">Airtime2Cash OTP</h2>
                <p>Please enter this OTP to confirm your transaction
                </p>
                <div style="text-align:center ;">
                        <a href='#'
                style="background: #277BC0; text-decoration: none; color: white;
                        padding: 10px 20px; margin: 10px 0;
                display: inline-block;">${otp}</a>
                </div>
                </div>                
      `;
        return temp;
}