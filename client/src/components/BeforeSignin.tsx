import { useNavigate } from "react-router-dom";
import { PrimaryButton, RewardButton, SuccessButton } from "./button";

export const BeforeSignin = () => {
    const navigate = useNavigate();
    function handleSignup () {
        navigate('/signup')
    }

    function handleSignin () {
        navigate('/login')
    }

    return (
        <div className="flex items-center">
            <div className="p-1">
                    <PrimaryButton onClick={handleSignup}>Sign up</PrimaryButton>
                    <SuccessButton onClick={handleSignin}>Sign in</SuccessButton>
            </div>
        </div>
    )
}