from django import forms 

# a form defined so that django can easily parse 
#   all relevant data from a POST-request for a new challenge 
class ChallengeForm(forms.Form):
    title = forms.CharField(max_length=100)
    # description = forms.CharField(widget=forms.Textarea)

    # description ist jetzt optional
    description = forms.CharField(
        required=False,              # Feld darf fehlen
        widget=forms.Textarea,       # mehrzeiliges Textfeld
        max_length=100             # optional: Längenlimit
    )
    xai_method = forms.FileField()
    dataset = forms.FileField()
    mlmodel = forms.FileField()

class ScoreForm(forms.Form):
    file = forms.FileField()
    username= forms.CharField(max_length=100)
    method_name = forms.CharField(max_length=100, required=False)  