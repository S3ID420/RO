from flask import Flask, request, jsonify
from flask_cors import CORS
from gurobipy import Model, GRB, quicksum

app = Flask(__name__)
CORS(app) 
# Function to solve the optimization problem








def solve_optimization(M, P, C, TM, TD,Cr):
    try:
        n = len(M)
        w = [P[i] / C[i] for i in range(n)]
        a = TD / sum(w)

        # Create the Gurobi model
        model = Model("Optimisation de la révision")

        # Decision variables
        t = [model.addVar(lb=TM, ub=TD, vtype=GRB.CONTINUOUS, name=f"T_{i + 1}") for i in range(n)]

        # Objective function
        model.setObjective(quicksum((P[i]*C[i]) * t[i] for i in range(n)), GRB.MAXIMIZE)

        # Constraints
        model.addConstr(quicksum(t) <= TD, "Temps_Disponible")
        if(Cr=="Priorite"):
           for i in range(n):
                model.addConstr(t[i] >= a * (P[i] / C[i]), f"ContrainteTemps_{i + 1}")
        elif(Cr=="Complexite"):
            for i in range(n):
                model.addConstr(t[i] >= a * (C[i] / P[i]), f"ContrainteTemps_{i + 1}")
        # Optimize
        model.optimize()

        # Check for optimal solution
        if model.status == GRB.OPTIMAL:
            solution = []
            for i in range(n):
                time_in_hours = t[i].x
                full_hours = int(time_in_hours)
                minutes = int((time_in_hours - full_hours) * 60)
                solution.append({
                    "subject": M[i],
                    "time": f"{full_hours} hours and {minutes} minutes"
                })

            return {
                "status": "optimal",
                "total_score": round(model.objVal, 2),
                "schedule": solution
            }
        else:
            return {"status": "no_solution", "message": "No optimal solution found."}

    except Exception as e:
        return {"status": "error", "message": str(e)}









# Flask Route to Solve Optimization
@app.route('/solve', methods=['POST'])
def solve():
    try:
        # Get input data from request
        data = request.json
        Cr=data.get("critere")
        M = data.get("tasks", [])  # List of subjects
        P = [int(p) for p in data.get("priorités", [])]  # List of priorities (converted to integers)
        C = [int(c) for c in data.get("complexités", [])]  # List of complexities (converted to integers)
        TM = int(data.get("min_time", 0))  # Minimum time for each subject
        TD = int(data.get("total_time", 0))  # Total available time

        # Input validation
        if not all([M, P, C, TM, TD,Cr]):
            return jsonify({"status": "error", "message": "Invalid input data."}), 400

        # Solve the optimization
        result = solve_optimization(M, P, C, TM, TD,Cr)
        return jsonify(result)

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)