# Machine Learning Methodology & Econometric Modeling

This document outlines the theoretical mathematical foundations, preprocessing pipeline, model training, and evaluation rigor employed in the **HomePrice AI** valuation engine.

---

## 1. Multiple Linear Regression Formulation

Multiple Linear Regression models the linear relationship between a continuous dependent target variable $Y$ (House Fair Market Value in Indian Rupees ₹) and a vector of $p$ explanatory predictor variables $\mathbf{X} = [X_1, X_2, \dots, X_p]^T$:

$$Y = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \dots + \beta_p X_p + \epsilon$$

In compact matrix notation for $n$ observations:

$$\mathbf{y} = \mathbf{X}\boldsymbol{\beta} + \boldsymbol{\epsilon}$$

Where:
- $\mathbf{y} \in \mathbb{R}^{n \times 1}$: Vector of observed market listing prices.
- $\mathbf{X} \in \mathbb{R}^{n \times (p+1)}$: Design matrix of property features (including a column of ones for the intercept).
- $\boldsymbol{\beta} \in \mathbb{R}^{(p+1) \times 1}$: Vector of regression coefficients (feature weights).
- $\boldsymbol{\epsilon} \in \mathbb{R}^{n \times 1}$: Unobserved random disturbance vector, assumed $\boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \sigma^2 \mathbf{I})$.

---

## 2. Ordinary Least Squares (OLS) Optimization

The parameter vector $\hat{\boldsymbol{\beta}}$ is estimated by minimizing the **Residual Sum of Squares (RSS)**:

$$S(\boldsymbol{\beta}) = \sum_{i=1}^n (y_i - \hat{y}_i)^2 = (\mathbf{y} - \mathbf{X}\boldsymbol{\beta})^T (\mathbf{y} - \mathbf{X}\boldsymbol{\beta})$$

Expanding the quadratic matrix equation:

$$S(\boldsymbol{\beta}) = \mathbf{y}^T \mathbf{y} - 2\boldsymbol{\beta}^T \mathbf{X}^T \mathbf{y} + \boldsymbol{\beta}^T \mathbf{X}^T \mathbf{X}\boldsymbol{\beta}$$

Taking the gradient with respect to $\boldsymbol{\beta}$ and equating to zero:

$$\frac{\partial S}{\partial \boldsymbol{\beta}} = -2\mathbf{X}^T \mathbf{y} + 2\mathbf{X}^T \mathbf{X}\boldsymbol{\beta} = \mathbf{0}$$

$$\mathbf{X}^T \mathbf{X}\hat{\boldsymbol{\beta}} = \mathbf{X}^T \mathbf{y}$$

Assuming $\mathbf{X}^T \mathbf{X}$ is non-singular (full column rank with no perfect multicollinearity), the unique global optimal solution is the closed-form normal equation:

$$\hat{\boldsymbol{\beta}} = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{y}$$

---

## 3. Preprocessing & Feature Engineering Pipeline

### A. Numerical Standardization (`StandardScaler`)
For numerical predictors ($X_j \in \{\text{Area\_sqft}, \text{BHK}, \text{Bathrooms}, \text{Floors}, \text{Property\_Age}\}$):

$$z = \frac{X_j - \mu_j}{\sigma_j}$$

Standardization centers feature distributions at mean 0 with unit variance, stabilizing numerical conditioning and allowing direct coefficient comparison.

### B. Categorical Encoding (`OneHotEncoder`)
Categorical attributes ($\{\text{City}, \text{Parking}, \text{Furnishing}, \text{Property\_Type}\}$) are converted into orthogonal binary indicator variables with `drop='first'` to prevent the **dummy variable trap** (perfect multicollinearity):
- **Safety Mechanism**: `handle_unknown='ignore'` is configured so that any unencountered category passed in future user queries evaluates to zero without raising an unhandled exception.

---

## 4. Model Evaluation Metrics

Performance is validated on an independent, unseen test sample of 1,000 observations (20% holdout split, `random_state=42`).

### A. Coefficient of Determination ($R^2$ Score)
$$R^2 = 1 - \frac{\sum_{i=1}^n (y_i - \hat{y}_i)^2}{\sum_{i=1}^n (y_i - \bar{y})^2} = 1 - \frac{\text{SS}_{\text{res}}}{\text{SS}_{\text{tot}}}$$
- **Achieved Score**: **0.8761 (87.61%)**
- **Interpretation**: 87.61% of the total variance in multi-city property valuations is explained by the 9 structural and geographical attributes.

### B. Mean Absolute Error (MAE)
$$\text{MAE} = \frac{1}{n} \sum_{i=1}^n |y_i - \hat{y}_i|$$
- **Achieved MAE**: **₹4,057,433.66** (~₹40.57 Lakhs)
- Represents the average absolute difference between actual and predicted valuations across properties ranging from ₹21 Lakhs to ₹15+ Crores.

### C. Mean Squared Error (MSE)
$$\text{MSE} = \frac{1}{n} \sum_{i=1}^n (y_i - \hat{y}_i)^2$$
- **Achieved MSE**: **₹4.1498 \times 10^{13}**

### D. Root Mean Squared Error (RMSE)
$$\text{RMSE} = \sqrt{\text{MSE}} = \sqrt{\frac{1}{n} \sum_{i=1}^n (y_i - \hat{y}_i)^2}$$
- **Achieved RMSE**: **₹6,441,919.99** (~₹64.42 Lakhs)
- Maintains dimensional consistency with the target currency unit (₹ INR).

### E. Mean Absolute Percentage Error (MAPE)
$$\text{MAPE} = \frac{100\%}{n} \sum_{i=1}^n \left| \frac{y_i - \hat{y}_i}{y_i} \right|$$
- **Achieved MAPE**: **28.74%**

---

## 5. Prediction Interval Formulation

To account for inherent econometric market volatility, predictions are reported alongside a statistical bounds interval:

$$\text{Margin of Error} = z_{\alpha/2} \times \text{RMSE}$$

For a 90% confidence level ($z_{0.05} \approx 1.645$):

$$\text{Lower Bound} = \max(₹10,00,000, \hat{y} - 1.645 \cdot \text{RMSE})$$
$$\text{Upper Bound} = \hat{y} + 1.645 \cdot \text{RMSE}$$
