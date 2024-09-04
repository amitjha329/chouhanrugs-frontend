import { redirect } from "next/navigation";
import "./not_found.css"

export default function NotFound() {
    return redirect('/')
    return (
        <div className="center">
            <div className="error">
                <div className="number">4</div>
                <div className="illustration">
                    <div className="circle" />
                    <div className="clip">
                        <div className="paper">
                            <div className="face">
                                <div className="eyes">
                                    <div className="eye eye-left" />
                                    <div className="eye eye-right" />
                                </div>
                                <div className="rosyCheeks rosyCheeks-left" />
                                <div className="rosyCheeks rosyCheeks-right" />
                                <div className="mouth" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="number">4</div>
            </div>
            <div className="text">Oops. The page you&apos;re looking for doesn&apos;t exist.</div>
            <a className="button" href="/">
                Back Home
            </a>
        </div>

    );
};