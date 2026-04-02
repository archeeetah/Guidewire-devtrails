import os
import google.generativeai as genai
from services.agent.tools import AOLTools
import json
import logging

logger = logging.getLogger("shramshield.agent")

class AOLOrchestrator:
    """
    ShramShield AOL: Gemini-powered Agentic Liaison.
    This orchestrator handles tool-calling loops to resolve complex worker issues.
    """

    def __init__(self):
        # In a real product, API keys are stored in Vault/Secrets Manager.
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.warning("GEMINI_API_KEY not found in environment. Agent will run in simulated mode.")
        
        genai.configure(api_key=api_key)

        # Define the system instruction for the "ShramShield Guardian"
        self.system_instruction = (
            "You are the ShramShield Guardian, an autonomous AI insurance agent for India's gig economy. "
            "Your goal is to protect the livelihoods of delivery partners (Zomato, Swiggy, etc.) through "
            "proactive safety alerts and no-touch claim settlement. "
            "You have access to real-time tools for weather, telemetry inspection, and payouts. "
            "Guidelines: "
            "1. Be empathetic but professional. Use Hinglish if the user prefers. "
            "2. Always verify telemetry if a user asks about a payout. "
            "3. If a claim is 'SUSPICIOUS' per the tools, explain why (e.g., GPS jumps) but remain helpful. "
            "4. For the investor pitch: Highlight your multi-step 'Reasoning Trace' so they see your autonomous value."
        )

        # Initialize the model with tool definitions
        # Note: We wrap AOLTools methods as tool declarations
        self.model = genai.GenerativeModel(
            model_name='gemini-1.5-pro',
            tools=[
                AOLTools.get_live_risk_assessment,
                AOLTools.investigate_payout_status,
                AOLTools.calculate_premium_quote,
                AOLTools.get_proactive_safety_plan,
                AOLTools.run_autonomous_claim_verification
            ],
            system_instruction=self.system_instruction
        )

    def interact(self, query: str, history: list = None):
        """
        Processes a user query through the agentic reasoning loop.
        Returns a generator of 'Trace' events and the final response for the UI.
        """
        chat = self.model.start_chat(enable_automatic_function_calling=True, history=history)
        
        # Initial response from the model (which might trigger tool calls)
        response = chat.send_message(query)
        
        # In this implementation, 'enable_automatic_function_calling=True' handles the loop.
        # To provide a 'Reasoning Trace' for the UI, we can inspect the response parts.
        
        trace = []
        for part in response.candidates[0].content.parts:
            if part.function_call:
                trace.append({
                    "type": "tool_call",
                    "name": part.function_call.name,
                    "args": dict(part.function_call.args)
                })
        
        return {
            "text": response.text,
            "trace": trace,
            "updated_history": chat.history
        }

# Singleton instance
orchestrator = AOLOrchestrator()
